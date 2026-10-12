import { Test, TestingModule } from '@nestjs/testing';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';
import { TurnosService } from '../turnos/turnos.service';

describe('PacientesController', () => {
  let controller: PacientesController;

  const mockPacientesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockTurnosService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByPatient: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PacientesController],
      providers: [
        {
          provide: PacientesService,
          useValue: mockPacientesService,
        },
        {
          provide: TurnosService,
          useValue: mockTurnosService,
        },
      ],
    }).compile();

    controller = module.get<PacientesController>(PacientesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('debe llamar a pacientesService.findAll y retornar la lista de pacientes', async () => {
    const listaEsperada = [{ id: 1, nombre: 'Ana' }];
    mockPacientesService.findAll.mockResolvedValue(listaEsperada);

    const resultado = await controller.findAll();

    expect(resultado).toEqual(listaEsperada);
    expect(mockPacientesService.findAll).toHaveBeenCalled();
  });

  it('debe asignar el pacienteId desde el parámetro de la URL al crear un turno (createAppointment)', async () => {
    const pacienteId = 5;
    const bodyTurno = {
      fecha: '2026-11-10',
      hora: '14:30',
      razon: 'Consulta de control',
    };

    const turnoCreadoEsperado = {
      id: 10,
      ...bodyTurno,
      pacienteId,
    };

    mockTurnosService.create.mockResolvedValue(turnoCreadoEsperado);

    const resultado = await controller.createAppointment(pacienteId, bodyTurno as any);

    // Verificamos que el controller inyecte el pacienteId al DTO que le pasa a TurnosService
    expect(mockTurnosService.create).toHaveBeenCalledWith({
      ...bodyTurno,
      pacienteId,
    });
    expect(resultado).toEqual(turnoCreadoEsperado);
  });
});