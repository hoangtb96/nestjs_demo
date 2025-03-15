import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateBuildingsAndLocations1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create building table
        await queryRunner.createTable(
            new Table({
                name: 'buildings',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Create locations table
        await queryRunner.createTable(
            new Table({
                name: 'locations',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'location_number',
                        type: 'varchar',
                        length: '50',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'area',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'building_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'mpath',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'parent_id',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Enable uuid-ossp extension for UUID generation
        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        // Add foreign key for building reference
        await queryRunner.createForeignKey(
            'locations',
            new TableForeignKey({
                name: 'FK_LOCATION_BUILDING',
                columnNames: ['building_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'buildings',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );

        // Add self-referencing foreign key for parent-child relationship
        await queryRunner.createForeignKey(
            'locations',
            new TableForeignKey({
                name: 'FK_LOCATION_PARENT',
                columnNames: ['parent_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'locations',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );

        // Create trigger function for updating updated_at timestamp
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        `);

        // Create triggers for both tables
        await queryRunner.query(`
            CREATE TRIGGER update_buildings_updated_at
                BEFORE UPDATE ON buildings
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        `);

        await queryRunner.query(`
            CREATE TRIGGER update_locations_updated_at
                BEFORE UPDATE ON locations
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop triggers first
        await queryRunner.query('DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;');
        await queryRunner.query('DROP TRIGGER IF EXISTS update_buildings_updated_at ON buildings;');
        await queryRunner.query('DROP FUNCTION IF EXISTS update_updated_at_column;');

        // Drop foreign keys
        await queryRunner.dropForeignKey('locations', 'FK_LOCATION_PARENT');
        await queryRunner.dropForeignKey('locations', 'FK_LOCATION_BUILDING');

        // Drop tables
        await queryRunner.dropTable('locations');
        await queryRunner.dropTable('buildings');

        // Drop extension
        await queryRunner.query('DROP EXTENSION IF EXISTS "uuid-ossp"');
    }
} 