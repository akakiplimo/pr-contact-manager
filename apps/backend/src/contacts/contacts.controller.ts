/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
// import { Role } from '../auth/enums/role.enum';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  /* DEBUG ENDPOINTS */

  @Get('verify-token')
  @UseGuards(JwtAuthGuard)
  verifyToken(@Request() req) {
    // If this succeeds, the token is valid
    console.log('Environment:', process.env.JWT_SECRET);
    console.log(
      'JWT Secret first few chars:',
      process.env.JWT_SECRET?.substring(0, 5) + '...',
    );
    return {
      valid: true,
      user: req.user,
    };
  }

  @Get('debug-token-details')
  debugTokenDetails(@Request() req) {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.replace('Bearer ', '');
      if (!token) {
        return { valid: false, error: 'No token provided' };
      }
      // Try to decode without verification
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { valid: false, error: 'Invalid token format' };
      }
      // This just decodes, doesn't verify signature
      const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      return {
        tokenStructure: {
          hasThreeParts: parts.length === 3,
          headerLength: parts[0].length,
          payloadLength: parts[1].length,
          signatureLength: parts[2].length,
        },
        payload: {
          sub: decoded.sub,
          // Don't expose all fields in production
          expiresAt: new Date(decoded.exp * 1000).toISOString(),
          issuedAt: decoded.iat
            ? new Date(decoded.iat * 1000).toISOString()
            : null,
        },
      };
    } catch (e) {
      return { valid: false, error: e.message };
    }
  }

  @Get('debug-token')
  debugToken(@Request() req) {
    console.log('Headers:', req.headers);
    console.log('Authorization:', req.headers.authorization);
    return {
      message: 'Token headers logged',
      hasAuthHeader: !!req.headers.authorization,
    };
  }

  @Get('debug-role')
  @UseGuards(JwtAuthGuard)
  debugRole(@Request() req) {
    return {
      hasUser: !!req.user,
      user: req.user,
      role: req.user?.role || 'No role found',
    };
  }

  /* DEBUG ENDPOINTS */

  @Post()
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.EDITOR)
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
    @Query('tags') tags?: string,
    @Query('organization') organization?: string,
  ) {
    const tagsArray = tags ? tags.split(',') : [];
    return this.contactsService.findAll(
      +page,
      +limit,
      search,
      tagsArray,
      organization,
    );
  }

  @Get('export')
  @UseGuards(JwtAuthGuard)
  exportToExcel() {
    return this.contactsService.exportToExcel();
  }

  @Get('tags')
  @UseGuards(JwtAuthGuard)
  getAllTags() {
    return this.contactsService.getAllTags();
  }

  @Get('organizations')
  @UseGuards(JwtAuthGuard)
  getAllOrganizations() {
    return this.contactsService.getAllOrganizations();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN, Role.EDITOR)
  update(@Param('id') id: string, @Body() updateContactDto: CreateContactDto) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }
}
