import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { InternalUserByProfileEntity } from './internal-user-by-profile.entity';

@Entity('public.internal_user_profile')
export class InternalUserProfileEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Unique Identifier',
  })
  id: number;

  @OneToMany(
    () => InternalUserByProfileEntity,
    (internal_user_by_profile) => internal_user_by_profile.profile,
  )
  @JoinColumn({ name: 'profile' })
  internal_user_by_profile: Promise<InternalUserByProfileEntity[]>;

  @Column({
    type: 'character varying',
    length: 255,
    comment: 'Internal user profile name',
  })
  name: string;

  @Column({
    type: 'integer',
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
    type: 'integer',
    comment: 'Internal user that inserted the registry',
    nullable: true,
  })
  insert_by_internal: number;

  @Column({
    type: 'timestamp with time zone',
    comment: 'Update Date',
    nullable: true,
  })
  update_date: Date;

  @Column({
    type: 'integer',
    comment: 'Internal user that updated the registry',
    nullable: true,
  })
  update_by_internal: number;
}
