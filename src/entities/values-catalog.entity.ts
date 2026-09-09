import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('public.values_catalog')
export class ValuesCatalogEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    comment: 'Unique Identifier',
  })
  id: number;

  @ApiProperty()
  @Column({
    type: 'character varying',
    length: 255,
    comment: 'Values catalog category',
  })
  category: string;

  @ApiProperty()
  @Column({
    type: 'character varying',
    length: 255,
    comment: 'Values catalog item name',
  })
  name: string;

  @ApiProperty()
  @Column({
    type: 'int',
    comment: 'Active record boolean attribute',
    default: 0,
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
    type: 'int',
    comment: 'Internal user that updated the record',
    nullable: true,
  })
  update_by_internal: number;
}
