import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

@Controller(':shopId/order')
export class OrderController {}
