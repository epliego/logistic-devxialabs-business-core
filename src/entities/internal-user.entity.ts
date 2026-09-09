import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { InternalUserByProfileEntity } from './internal-user-by-profile.entity';

@Entity('public.internal_user')
export class InternalUserEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Unique Identifier',
  })
  id: number;

  @OneToMany(
    () => InternalUserByProfileEntity,
    (internal_user_by_profile) => internal_user_by_profile.user,
  )
  @JoinColumn({ name: 'user' })
  internal_user_by_profile: Promise<InternalUserByProfileEntity[]>;

  @ApiProperty()
  @Column({
    type: 'character varying',
    length: 255,
    comment: 'Internal user email',
  })
  email: string;

  @ApiProperty()
  @Column({
    type: 'character varying',
    length: 255,
    comment: 'Internal user name',
  })
  name: string;

  @ApiProperty()
  @Column({
    type: 'character varying',
    length: 255,
    comment: 'Hashed password',
  })
  password: string;

  @Column({
    type: 'int',
    comment: 'Active register boolean atribute',
    default: 1,
  })
  active: number;

  @Column({
    type: 'timestamp with time zone',
    comment: 'Insert Date',
    default: () => 'CURRENT_TIMESTAMP',
  })
  insert_date: Date;

  @Column({
    type: 'int',
    comment: 'Internal user that inserted the registry',
    default: 1,
  })
  insert_by_internal: number;

  @Column({
    type: 'timestamp with time zone',
    comment: 'Update Date',
    nullable: true,
  })
  update_date: Date;

  @Column({
    type: 'int',
    comment: 'Internal user that updated the registry',
    nullable: true,
  })
  update_by_internal: number;
}
