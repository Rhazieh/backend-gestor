import { Test, TestingModule } from '@nestjs/testing';
import { TurnosController } from './turnos.controller';
import { TurnosService } from './turnos.service';

describe('TurnosController', () => {
  let controller: TurnosController;

  const mockTurnosService = {
    findAll: jest.fn(),
    findByFilters: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TurnosController],
      providers: [
        {
          provide: TurnosService,
          useValue: mockTurnosService,
        },
      ],
    }).compile();

    controller = module.get<TurnosController>(TurnosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('debe crear un turno y retornar el objeto completo invocando findOne (create)', async () => {
    const dto = {
      fecha: '2026-10-30',
      hora: '09:00',
      razon: 'Odontología',
      pacienteId: 2,
    };

    const turnoCreado = { id: 7, ...dto };
    const turnoCompleto = { ...turnoCreado, paciente: { id: 2, nombre: 'Lucia' } };

    mockTurnosService.create.mockResolvedValue(turnoCreado);
    mockTurnosService.findOne.mockResolvedValue(turnoCompleto);

    const resultado = await controller.create(dto);

    // Verifica que llame a create con el DTO
    expect(mockTurnosService.create).toHaveBeenCalledWith(dto);
    // Verifica que pida el turno completo con findOne usando el id generado
    expect(mockTurnosService.findOne).toHaveBeenCalledWith(7);
    expect(resultado).toEqual(turnoCompleto);
  });

  it('debe delegar en findByFilters cuando se pasan query params en findAll', async () => {
    const fecha = '2026-10-30';
    const pacienteIdStr = '5';
    const turnosFiltrados = [{ id: 1, fecha, pacienteId: 5 }];

    mockTurnosService.findByFilters.mockResolvedValue(turnosFiltrados);

    const resultado = await controller.findAll(fecha, pacienteIdStr);

    // Verifica que convierta el query param pacienteId a number y llame a findByFilters
    expect(mockTurnosService.findByFilters).toHaveBeenCalledWith({
      fecha: '2026-10-30',
      pacienteId: 5,
    });
    expect(resultado).toEqual(turnosFiltrados);
  });
});