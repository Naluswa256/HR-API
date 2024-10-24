import { Router } from 'express';
import ShiftController from '@/controllers/shift.controller'; // Import the ShiftController
import BaseRoute from '@/interfaces/routes.interface';
import {shiftSchema, updateShiftSchema} from '@/schemas/shift.validation.schemas';
import validate from '@/middlewares/validation.middleware';
import auth from '@/middlewares/auth.middleware';


/**
 * @swagger
 * tags:
 *   name: Shifts
 *   description: API to manage work shifts
 */

/**
 * @swagger
 * /shifts:
 *   post:
 *     summary: Create a new shift
 *     description: HR Admins can create a new shift for employees.
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Payload to create a shift
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Shift'
 *     responses:
 *       201:
 *         description: Shift created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Shift created successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Shift'
 *       400:
 *         description: Bad request or validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid date format for shift_start
 *       403:
 *         description: Forbidden - Not enough permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You do not have permission to modify this shift.
 */

/**
 * @swagger
 * /shifts:
 *   get:
 *     summary: Get all shifts
 *     description: Retrieve all shifts created by the HR Admin.
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shifts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Shifts retrieved successfully!
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Shift'
 *       403:
 *         description: Forbidden - Not enough permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You do not have permission to view these shifts.
 */

/**
 * @swagger
 * /shifts/{id}:
 *   put:
 *     summary: Update a shift by ID
 *     description: HR Admins can update an existing shift.
 *     tags: [Shifts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Shift ID
 *     requestBody:
 *       description: Payload to update the shift
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateShift'
 *     responses:
 *       200:
 *         description: Shift updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Shift updated successfully!
 *                 data:
 *                   $ref: '#/components/schemas/Shift'
 *       404:
 *         description: Shift not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Shift does not exist.
 *       403:
 *         description: Forbidden - Not enough permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: You do not have permission to modify this shift.
 */


class ShiftRoute extends BaseRoute {
  public path = '/shifts'; // Set the base path for shift routes

  protected initializeRoutes(): void {
    this.router.route('/').post(auth('manageUsers'),validate(shiftSchema), ShiftController.createShift).get(auth(),ShiftController.getShifts); // Get all shifts
    this.router.route('/:id').put(auth('manageUsers'),validate(updateShiftSchema), ShiftController.updateShift); // Update a shift by ID
  }
}

export default ShiftRoute;
