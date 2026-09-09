import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { InternalUserEntity } from './internal-user.entity';
import { InternalUserProfileEntity } from './internal-user-profile.entity';

@Entity('public.internal_user_by_profile')
export class InternalUserByProfileEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Unique Identifier',
  })
  id: number;

  @OneToOne(() => InternalUserEntity)
  @JoinColumn({ name: 'internal_user_id', referencedColumnName: 'id' })
  user: Promise<InternalUserEntity>;

  @OneToOne(() => InternalUserProfileEntity)
  @JoinColumn({ name: 'internal_user_profile_id', referencedColumnName: 'id' })
  profile: Promise<InternalUserProfileEntity>;

  @Column({
    type: 'integer',
    comment: 'Active register boolean attribute',
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
    type: 'integer',
    comment: 'Internal user that updated the registry',
    nullable: true,
  })
  update_by_internal: number;
}
