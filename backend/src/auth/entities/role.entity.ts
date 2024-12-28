import { BaseEntity, Entity, PrimaryColumn } from 'typeorm';

@Entity({ schema: 'public', name: 'role' })
export class Role extends BaseEntity {
  @PrimaryColumn({
    name: 'name',
    type: 'varchar',
    unique: true,
    length: 100,
    nullable: false,
  })
  name: string;
}
