import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity('users')
export default class User {
	@PrimaryGeneratedColumn('increment')
		id: number;

	@Column('varchar', {length: 100, nullable: false})
		name: string;

	@Column('varchar', {length: 100, nullable: false})
		email: string;

	@Column('varchar', {length: 100, nullable: false})
		passwordHash: string;

	@Column('varchar', {length: 100, nullable: false})
		role: string;

	@Column('varchar', {length: 40, nullable: false})
		photo: string;

	@Column('varchar', {length: 104, nullable: false})
		verifyToken: string;
}
