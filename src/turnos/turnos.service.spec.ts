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
    create: jest.fn().mockImplementation((dto: Partial<Turno>) => dto),
    save: jest
      .fn()
      .mockImplementation((t: Partial<Turno>) =>
        Promise.resolve({ id: 1, ...t }),
      ),
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

    expect(mockPacientesRepo.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
    });
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
    mockTurnosRepo.findOne.mockResolvedValue({
      id: 99,
      fecha: dto.fecha,
      hora: dto.hora,
    });

    await expect(service.create(dto)).rejects.toThrow(ConflictException);
    // Verificamos que nunca se haya llamado a guardar
    expect(mockTurnosRepo.save).not.toHaveBeenCalled();
  });

  it('debe lanzar NotFoundException al crear un turno si el paciente no existe', async () => {
    mockPacientesRepo.findOne.mockResolvedValue(null);

    await expect(
      service.create({
        pacienteId: 99,
        fecha: '2026-10-25',
        hora: '10:00',
        razon: 'Control',
      }),
    ).rejects.toThrow(NotFoundException);
    expect(mockTurnosRepo.save).not.toHaveBeenCalled();
  });

  it('debe listar todos los turnos ordenados (findAll)', async () => {
    const lista = [{ id: 1, fecha: '2026-10-25', hora: '10:00' }];
    mockTurnosRepo.find.mockResolvedValue(lista);

    const resultado = await service.findAll();

    expect(mockTurnosRepo.find).toHaveBeenCalledWith({
      relations: ['paciente'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
    expect(resultado).toEqual(lista);
  });

  it('debe buscar un turno por ID (findOne) o lanzar 404 si no existe', async () => {
    const turno = { id: 1, fecha: '2026-10-25', hora: '10:00' };
    mockTurnosRepo.findOne.mockResolvedValueOnce(turno);

    const resultado = await service.findOne(1);
    expect(resultado).toEqual(turno);

    mockTurnosRepo.findOne.mockResolvedValueOnce(null);
    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('debe listar los turnos de un paciente específico (findByPatient)', async () => {
    const lista = [{ id: 1, paciente: { id: 3 } }];
    mockTurnosRepo.find.mockResolvedValue(lista);

    const resultado = await service.findByPatient(3);

    expect(mockTurnosRepo.find).toHaveBeenCalledWith({
      where: { paciente: { id: 3 } },
      relations: ['paciente'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
    expect(resultado).toEqual(lista);
  });

  it('debe filtrar turnos por fecha y pacienteId (findByFilters)', async () => {
    const filtrados = [{ id: 2, fecha: '2026-10-25' }];
    mockTurnosRepo.find.mockResolvedValue(filtrados);

    const resultado = await service.findByFilters({
      fecha: '2026-10-25',
      pacienteId: 2,
    });

    expect(mockTurnosRepo.find).toHaveBeenCalledWith({
      where: { fecha: '2026-10-25', paciente: { id: 2 } },
      relations: ['paciente'],
      order: { fecha: 'ASC', hora: 'ASC' },
    });
    expect(resultado).toEqual(filtrados);

    await service.findByFilters({});
    expect(mockTurnosRepo.find).toHaveBeenCalledTimes(2);
  });

  it('debe actualizar un turno y rechazar colisión de horario (update)', async () => {
    mockTurnosRepo.findOne
      .mockResolvedValueOnce({
        id: 1,
        fecha: '2026-10-25',
        hora: '10:00',
        razon: 'Control',
      })
      .mockResolvedValueOnce(null);

    const actualizado = await service.update(1, {
      hora: '11:00',
      razon: 'Urgencia',
    });

    expect(mockTurnosRepo.save).toHaveBeenCalled();
    expect(actualizado).toEqual({
      id: 1,
      fecha: '2026-10-25',
      hora: '11:00',
      razon: 'Urgencia',
    });

    mockTurnosRepo.findOne
      .mockResolvedValueOnce({
        id: 1,
        fecha: '2026-10-25',
        hora: '10:00',
        razon: 'Control',
      })
      .mockResolvedValueOnce({ id: 2, fecha: '2026-10-25', hora: '12:00' });

    await expect(service.update(1, { hora: '12:00' })).rejects.toThrow(
      ConflictException,
    );
  });

  it('debe eliminar un turno existente (remove)', async () => {
    const turno = { id: 1, fecha: '2026-10-25', hora: '10:00' };
    mockTurnosRepo.findOne.mockResolvedValue(turno);
    mockTurnosRepo.remove.mockResolvedValue(turno);

    const resultado = await service.remove(1);

    expect(mockTurnosRepo.remove).toHaveBeenCalledWith(turno);
    expect(resultado).toEqual({ deleted: true, id: 1 });
  });
});
