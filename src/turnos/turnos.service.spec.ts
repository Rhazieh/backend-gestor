import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { Turno } from './entities/turno.entity';
import { Paciente } from '../pacientes/entities/paciente.entity';

describe('TurnosService', () => {
  let service: TurnosService;

  const mockTurnosRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((t) => Promise.resolve({ id: 1, ...t })),
    remove: jest.fn(),
  };

  const mockPacientesRepo = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TurnosService,
        {
          provide: getRepositoryToken(Turno),
          useValue: mockTurnosRepo,
        },
        {
          provide: getRepositoryToken(Paciente),
          useValue: mockPacientesRepo,
        },
      ],
    }).compile();

    service = module.get<TurnosService>(TurnosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debe crear un turno correctamente si el paciente existe y no hay solapamiento de horario', async () => {
    const pacienteMock = { id: 1, nombre: 'Ana' };
    const dto = {
      pacienteId: 1,
      fecha: '2026-10-25',
      hora: '10:00',
      razon: 'Consulta general',
    };

    // 1. Simula que el paciente existe
    mockPacientesRepo.findOne.mockResolvedValue(pacienteMock);
    // 2. Simula que NO hay turno previo en esa fecha y hora
    mockTurnosRepo.findOne.mockResolvedValue(null);

    const resultado = await service.create(dto);

    expect(mockPacientesRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(mockTurnosRepo.findOne).toHaveBeenCalledWith({
      where: { fecha: dto.fecha, hora: dto.hora },
    });
    expect(mockTurnosRepo.create).toHaveBeenCalledWith({
      fecha: dto.fecha,
      hora: dto.hora,
      razon: dto.razon,
      paciente: pacienteMock,
    });
    expect(resultado).toEqual({
      id: 1,
      fecha: dto.fecha,
      hora: dto.hora,
      razon: dto.razon,
      paciente: pacienteMock,
    });
  });

  it('debe lanzar ConflictException si ya existe un turno en la misma fecha y hora', async () => {
    const pacienteMock = { id: 1, nombre: 'Ana' };
    const dto = {
      pacienteId: 1,
      fecha: '2026-10-25',
      hora: '10:00',
      razon: 'Consulta general',
    };

    // 1. El paciente existe
    mockPacientesRepo.findOne.mockResolvedValue(pacienteMock);
    // 2. Ya existe un turno reservado en ese mismo horario
    mockTurnosRepo.findOne.mockResolvedValue({ id: 99, fecha: dto.fecha, hora: dto.hora });

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
    // Verificamos que nunca se haya llamado a guardar
    expect(mockTurnosRepo.save).not.toHaveBeenCalled();
  });
});