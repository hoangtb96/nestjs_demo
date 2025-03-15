export class UpdateLocationCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly locationNumber?: string,
    public readonly area?: string,
    public readonly buildingId?: string,
    public readonly buildingName?: string,
    public readonly parentId?: string,
  ) {}
} 