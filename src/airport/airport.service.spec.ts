import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirportService } from './airport.service';
import { AirportEntity } from './entities/airport.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AirportService', () => {
  let service: AirportService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirportService,
        {
          provide: getRepositoryToken(AirportEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AirportService>(AirportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of airports', async () => {
      const airports = [new AirportEntity(), new AirportEntity()];
      mockRepository.find.mockResolvedValue(airports);

      expect(await service.findAll()).toEqual(airports);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['aerolineas'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single airport', async () => {
      const airport = new AirportEntity();
      mockRepository.findOne.mockResolvedValue(airport);

      expect(await service.findOne(1)).toEqual(airport);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['aerolineas'],
      });
    });

    it('should throw NotFoundException if airport not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return an airport', async () => {
      const createAirportDto = {
        nombre: 'Test AirportEntity',
        codigo: 'TST',
        pais: 'Test Country',
        ciudad: 'Test City',
      };

      const airport = new AirportEntity();
      mockRepository.create.mockReturnValue(airport);
      mockRepository.save.mockResolvedValue(airport);

      expect(await service.create(createAirportDto)).toEqual(airport);
      expect(mockRepository.create).toHaveBeenCalledWith(createAirportDto);
      expect(mockRepository.save).toHaveBeenCalledWith(airport);
    });

    it('should throw BadRequestException if code length is not 3', async () => {
      const createAirportDto = {
        nombre: 'Test AirportEntity',
        codigo: 'TESTLONG',
        pais: 'Test Country',
        ciudad: 'Test City',
      };

      await expect(service.create(createAirportDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update and return an airport', async () => {
      const updateAirportDto = {
        nombre: 'Updated AirportEntity',
      };

      const airport = new AirportEntity();
      mockRepository.findOne.mockResolvedValue(airport);
      mockRepository.save.mockResolvedValue({
        ...airport,
        ...updateAirportDto,
      });

      expect(await service.update(1, updateAirportDto)).toEqual({
        ...airport,
        ...updateAirportDto,
      });
      expect(mockRepository.merge).toHaveBeenCalledWith(
        airport,
        updateAirportDto,
      );
      expect(mockRepository.save).toHaveBeenCalledWith(airport);
    });

    it('should throw NotFoundException if airport not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if code length is not 3', async () => {
      const airport = new AirportEntity();
      mockRepository.findOne.mockResolvedValue(airport);

      const updateAirportDto = {
        codigo: 'TESTLONG',
      };

      await expect(service.update(1, updateAirportDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an airport', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if airport not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
