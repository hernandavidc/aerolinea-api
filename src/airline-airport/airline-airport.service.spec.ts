import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AirlineAirportService } from './airline-airport.service';
import { AirlineService } from '../airline/airline.service';
import { AirportService } from '../airport/airport.service';
import { AirlineEntity } from '../airline/entities/airline.entity';
import { AirportEntity } from '../airport/entities/airport.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('AirlineAirportService', () => {
  let service: AirlineAirportService;

  const mockAirlineService = {
    findOne: jest.fn(),
  };

  const mockAirportService = {
    findOne: jest.fn(),
  };

  const mockAirlineRepository = {
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AirlineAirportService,
        {
          provide: AirlineService,
          useValue: mockAirlineService,
        },
        {
          provide: AirportService,
          useValue: mockAirportService,
        },
        {
          provide: getRepositoryToken(AirlineEntity),
          useValue: mockAirlineRepository,
        },
      ],
    }).compile();

    service = module.get<AirlineAirportService>(AirlineAirportService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addAirportToAirline', () => {
    it('should add an airport to an airline', async () => {
      const airline = new AirlineEntity();
      airline.aeropuertos = [];

      const airport = new AirportEntity();
      airport.id = 1;

      mockAirlineService.findOne.mockResolvedValue(airline);
      mockAirportService.findOne.mockResolvedValue(airport);
      mockAirlineRepository.save.mockResolvedValue({
        ...airline,
        aeropuertos: [airport],
      });

      expect(await service.addAirportToAirline(1, 1)).toEqual({
        ...airline,
        aeropuertos: [airport],
      });
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirportService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirlineRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          aeropuertos: [expect.objectContaining({ id: 1 })],
        }),
      );
    });

    it('should throw BadRequestException if airport is already associated with airline', async () => {
      const airport = new AirportEntity();
      airport.id = 1;

      const airline = new AirlineEntity();
      airline.aeropuertos = [airport];

      mockAirlineService.findOne.mockResolvedValue(airline);
      mockAirportService.findOne.mockResolvedValue(airport);

      await expect(service.addAirportToAirline(1, 1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAirportsFromAirline', () => {
    it('should return all aeropuertos from an airline', async () => {
      const airport1 = new AirportEntity();
      const airport2 = new AirportEntity();

      const airline = new AirlineEntity();
      airline.aeropuertos = [airport1, airport2];

      mockAirlineService.findOne.mockResolvedValue(airline);

      expect(await service.findAirportsFromAirline(1)).toEqual([
        airport1,
        airport2,
      ]);
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findAirportFromAirline', () => {
    it('should return a specific airport from an airline', async () => {
      const airport = new AirportEntity();
      airport.id = 1;

      const airline = new AirlineEntity();
      airline.aeropuertos = [airport];

      mockAirlineService.findOne.mockResolvedValue(airline);

      expect(await service.findAirportFromAirline(1, 1)).toEqual(airport);
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if airport is not associated with airline', async () => {
      const airline = new AirlineEntity();
      airline.aeropuertos = [];

      mockAirlineService.findOne.mockResolvedValue(airline);

      await expect(service.findAirportFromAirline(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateAirportsFromAirline', () => {
    it('should update all aeropuertos from an airline', async () => {
      const airline = new AirlineEntity();

      const airport1 = new AirportEntity();
      airport1.id = 1;

      const airport2 = new AirportEntity();
      airport2.id = 2;

      mockAirlineService.findOne.mockResolvedValue(airline);
      mockAirportService.findOne
        .mockResolvedValueOnce(airport1)
        .mockResolvedValueOnce(airport2);
      mockAirlineRepository.save.mockResolvedValue({
        ...airline,
        aeropuertos: [airport1, airport2],
      });

      expect(await service.updateAirportsFromAirline(1, [1, 2])).toEqual({
        ...airline,
        aeropuertos: [airport1, airport2],
      });
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirportService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirportService.findOne).toHaveBeenCalledWith(2);
      expect(mockAirlineRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          aeropuertos: [
            expect.objectContaining({ id: 1 }),
            expect.objectContaining({ id: 2 }),
          ],
        }),
      );
    });

    it('should throw NotFoundException if an airport does not exist', async () => {
      const airline = new AirlineEntity();

      mockAirlineService.findOne.mockResolvedValue(airline);
      mockAirportService.findOne.mockRejectedValue(new NotFoundException());

      await expect(service.updateAirportsFromAirline(1, [999])).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteAirportFromAirline', () => {
    it('should delete an airport from an airline', async () => {
      const airport1 = new AirportEntity();
      airport1.id = 1;

      const airport2 = new AirportEntity();
      airport2.id = 2;

      const airline = new AirlineEntity();
      airline.aeropuertos = [airport1, airport2];

      const updatedAirline = { ...airline, aeropuertos: [airport2] };

      mockAirlineService.findOne.mockResolvedValue(airline);
      mockAirlineRepository.save.mockResolvedValue(updatedAirline);

      expect(await service.deleteAirportFromAirline(1, 1)).toEqual(
        updatedAirline,
      );
      expect(mockAirlineService.findOne).toHaveBeenCalledWith(1);
      expect(mockAirlineRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          aeropuertos: [expect.objectContaining({ id: 2 })],
        }),
      );
    });

    it('should throw NotFoundException if airport is not associated with airline', async () => {
      const airline = new AirlineEntity();
      airline.aeropuertos = [];

      mockAirlineService.findOne.mockResolvedValue(airline);

      await expect(service.deleteAirportFromAirline(1, 1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
