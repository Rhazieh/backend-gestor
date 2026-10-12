import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PacientesService } from './pacientes.service';
import { Paciente } from './entities/paciente.entity';

describe('PacientesService', () => {
  let service: PacientesService;

  // Objeto mock que simula el repositorio de TypeORM
  const mockPacienteRepo = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest.fn().mockImplementation((p) => Promise.resolve({ id: 1, ...p })),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    // Limpiamos los llamados previos de los mocks antes de cada test
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacientesService,
        {
          provide: getRepositoryToken(Paciente),
          useValue: mockPacienteRepo,
        },
      ],
    }).compile();

    service = module.get<PacientesService>(PacientesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('debe listar todos los pacientes incluyendo la relación con turnos (findAll)', async () => {
    const listaEsperada = [
      { id: 1, nombre: 'Carlos', apellido: 'Gomez', turnos: [] },
    ];
    mockPacienteRepo.find.mockResolvedValue(listaEsperada);

    const resultado = await service.findAll();

    // Verificamos que devuelva la lista esperada
    expect(resultado).toEqual(listaEsperada);
    // Verificamos que le pida a TypeORM traer la relación 'turnos'
    expect(mockPacienteRepo.find).toHaveBeenCalledWith({
      relations: ['turnos'],
    });
  });

  it('debe crear y persistir un nuevo paciente (create)', async () => {
    const dto = {
      nombre: 'Maria',
      apellido: 'Perez',
      email: 'maria@example.com',
      telefono: '123456',
    };

    const resultado = await service.create(dto as any);

    // Verificamos que arme la entidad en memoria y luego la guarde
    expect(mockPacienteRepo.create).toHaveBeenCalledWith(dto);
    expect(mockPacienteRepo.save).toHaveBeenCalled();
    // Verificamos que el paciente retornado tenga su ID asignado
    expect(resultado).toEqual({ id: 1, ...dto });
  });
});