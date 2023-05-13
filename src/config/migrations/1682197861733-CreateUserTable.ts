import {Table, type MigrationInterface, type QueryRunner} from 'typeorm';

export class CreateUserTable1682197861733 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'users',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						generationStrategy: 'increment',
					},
					{
						name: 'name',
						type: 'varchar',
						length: '100',
						isNullable: false,
					},
					{
						name: 'email',
						type: 'varchar',
						length: '100',
						isNullable: false,
					},
					{
						name: 'passwordHash',
						type: 'varchar',
						length: '100',
						isNullable: false,
					},
					{
						name: 'role',
						type: 'varchar',
						length: '100',
						isNullable: false,
					},
					{
						name: 'photo',
						type: 'varchar',
						length: '40',
						isNullable: false,
					},
					{
						name: 'verifyToken',
						type: 'varchar',
						length: '104',
						isNullable: false,
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('users');
	}
}
