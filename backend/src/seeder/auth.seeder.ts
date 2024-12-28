import { Injectable,  } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from '../auth/auth.repository';
import {Role} from '../auth/entities/role.entity'
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthSeeder {
  constructor(private readonly dataSource: DataSource,
    private readonly authRepository: AuthRepository,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>
  ) {}

  async run() {
    const adminRole = new Role()
    adminRole.name = 'admin';

    const roles = [
        {name: 'admin'},
        {name: 'user'}
    ]
    const users = [
      {
        userId: '127d9e1e-81db-4706-b7d3-e159738f952f',
        name: 'Admin User',
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: adminRole,
      },
      {
        userId: '1aac186c-5d68-4c0f-add9-e3120f336770',
        name: 'Regular User',
        email: 'admin1@example.com',
        password: await bcrypt.hash('user123', 10),
        role: adminRole,
      },
      {
        userId: '9d7f7bab-d2ec-40e3-a498-36d57119a532',
        name: 'Guest User',
        email: 'admin2@example.com',
        password: await bcrypt.hash('guest123', 10),
        role: adminRole,
      },
    ];
    const userPromises = []
    const rolePromises = []
    roles.forEach(({ name }) => {
        const model = this.roleRepository.save({
            name
        });
        try {
            rolePromises.push(model);
        } catch (e: any) {
            console.error('already exists');
        }
    });

    await Promise.all(rolePromises);

    users.forEach((user) => {
        const model = this.authRepository.save({
            ...user
        });

      try {
        userPromises.push(model);
        } catch (e: any) {
          console.error('already exists');
        }
      });


      await Promise.all(userPromises);
    console.log('Seeded users successfully');
  }
}
