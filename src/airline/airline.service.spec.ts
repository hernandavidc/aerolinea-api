import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirlineService } from './airline.service';
import { AirlineEntity } from './entities/airline.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AirlineService', () => {
  let service: AirlineService;

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
        AirlineService,
        {
          provide: getRepositoryToken(AirlineEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of airlines', async () => {
      const airlines = [new AirlineEntity(), new AirlineEntity()];
      mockRepository.find.mockResolvedValue(airlines);

      expect(await service.findAll()).toEqual(airlines);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['aeropuertos'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single airline', async () => {
      const airline = new AirlineEntity();
      mockRepository.findOne.mockResolvedValue(airline);

      expect(await service.findOne(1)).toEqual(airline);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['aeropuertos'],
      });
    });

    it('should throw NotFoundException if airline not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return an airline', async () => {
      const createAirlineDto = {
        nombre: 'Test AirlineEntity',
        descripcion: 'Test Description',
        fechaFundacion: new Date('2020-01-01'),
        website: 'http://test.com',
      };

      const airline = new AirlineEntity();
      mockRepository.create.mockReturnValue(airline);
      mockRepository.save.mockResolvedValue(airline);

      expect(await service.create(createAirlineDto)).toEqual(airline);
      expect(mockRepository.create).toHaveBeenCalledWith(createAirlineDto);
      expect(mockRepository.save).toHaveBeenCalledWith(airline);
    });

    it('should throw BadRequestException if foundation date is in the future', async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const createAirlineDto = {
        nombre: 'Test AirlineEntity',
        descripcion: 'Test Description',
        fechaFundacion: futureDate,
        website: 'http://test.com',
      };

      await expect(service.create(createAirlineDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update and return an airline', async () => {
      const updateAirlineDto = {
        nombre: 'Updated AirlineEntity',
      };

      const airline = new AirlineEntity();
      mockRepository.findOne.mockResolvedValue(airline);
      mockRepository.save.mockResolvedValue({
        ...airline,
        ...updateAirlineDto,
      });

      expect(await service.update(1, updateAirlineDto)).toEqual({
        ...airline,
        ...updateAirlineDto,
      });
      expect(mockRepository.merge).toHaveBeenCalledWith(
        airline,
        updateAirlineDto,
      );
      expect(mockRepository.save).toHaveBeenCalledWith(airline);
    });

    it('should throw NotFoundException if airline not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if foundation date is in the future', async () => {
      const airline = new AirlineEntity();
      mockRepository.findOne.mockResolvedValue(airline);

      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);

      const updateAirlineDto = {
        fechaFundacion: futureDate,
      };

      await expect(service.update(1, updateAirlineDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an airline', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.delete(1);
      expect(mockRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if airline not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });
});
