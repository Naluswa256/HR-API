import { Router } from 'express';
import OvertimeController from '@/controllers/overtime.controller';
import BaseRoute from '@/interfaces/routes.interface';
import validate from '@/middlewares/validation.middleware';
import {
    submitOvertimeRequestSchema,
    getOvertimeByEmployeeSchema,
    approveOvertimeRequestSchema,
    rejectOvertimeRequestSchema,
    getOvertimeRequestsByApprovalStatusSchema
} from '@/schemas/overtime.validation.schema';

/**
 * @swagger
 * tags:
 *   name: Overtime
 *   description: Overtime management APIs
 */

class OvertimeRoute extends BaseRoute {
    public path = '/overtime';

    protected initializeRoutes(): void {
        /**
         * @swagger
         * /overtime:
         *   post:
         *     tags: [Overtime]
         *     summary: Submit an Overtime Request
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/SubmitOvertimeRequest'
         *     responses:
         *       201:
         *         description: Overtime request submitted successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/OvertimeResponse'
         *       400:
         *         description: At least one overtime hour must be greater than zero.
         *       500:
         *         description: Internal Server Error
         */
        this.router.post(
            '/',
            validate(submitOvertimeRequestSchema),
            OvertimeController.submitOvertimeRequest
        );

        /**
         * @swagger
         * /overtime/{employee_id}:
         *   get:
         *     tags: [Overtime]
         *     summary: Get Overtime Requests by Employee ID
         *     parameters:
         *       - in: path
         *         name: employee_id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the employee
         *     responses:
         *       200:
         *         description: Overtime records retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/OvertimeResponse'
         *       404:
         *         description: Employee not found
         *       403:
         *         description: Unauthorized access
         */
        this.router.get(
            '/:employee_id',
            validate(getOvertimeByEmployeeSchema),
            OvertimeController.getOvertimeByEmployee
        );

        /**
         * @swagger
         * /overtime/approve/{overtime_id}:
         *   put:
         *     tags: [Overtime]
         *     summary: Approve an Overtime Request
         *     parameters:
         *       - in: path
         *         name: overtime_id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the overtime request to approve
         *     responses:
         *       200:
         *         description: Overtime request approved successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/OvertimeResponse'
         *       404:
         *         description: Overtime request not found
         *       400:
         *         description: Overtime request has already been approved.
         *       403:
         *         description: Unauthorized access
         */
        this.router.put(
            '/approve/:overtime_id',
            validate(approveOvertimeRequestSchema),
            OvertimeController.approveOvertimeRequest
        );

        /**
         * @swagger
         * /overtime/reject/{overtime_id}:
         *   put:
         *     tags: [Overtime]
         *     summary: Reject an Overtime Request
         *     parameters:
         *       - in: path
         *         name: overtime_id
         *         required: true
         *         schema:
         *           type: string
         *         description: The ID of the overtime request to reject
         *     requestBody:
         *       required: true
         *       content:
         *         application/json:
         *           schema:
         *             $ref: '#/components/schemas/RejectOvertimeRequest'
         *     responses:
         *       200:
         *         description: Overtime request rejected successfully
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/components/schemas/OvertimeResponse'
         *       404:
         *         description: Overtime request not found
         *       400:
         *         description: Overtime request has already been approved.
         *       403:
         *         description: Unauthorized access
         */
        this.router.put(
            '/reject/:overtime_id',
            validate(rejectOvertimeRequestSchema),
            OvertimeController.rejectOvertimeRequest
        );

        /**
         * @swagger
         * /overtime/approval-status:
         *   get:
         *     tags: [Overtime]
         *     summary: Get Overtime Requests by Approval Status
         *     parameters:
         *       - in: query
         *         name: approved
         *         required: false
         *         schema:
         *           type: string
         *           enum: [true, false]
         *         description: Filter by approval status
         *     responses:
         *       200:
         *         description: Overtime requests retrieved successfully
         *         content:
         *           application/json:
         *             schema:
         *               type: array
         *               items:
         *                 $ref: '#/components/schemas/OvertimeResponse'
         *       404:
         *         description: No employees found for this HR Admin.
         */
        this.router.get(
            '/approval-status',
            validate(getOvertimeRequestsByApprovalStatusSchema),
            OvertimeController.getOvertimeRequestsByApprovalStatus
        );
    }
}

export default OvertimeRoute;

/**
 * @swagger
 * components:
 *   schemas:
 *     SubmitOvertimeRequest:
 *       type: object
 *       properties:
 *         overtime_date:
 *           type: string
 *           format: date
 *           description: Date of the overtime
 *         regular_overtime_hours:
 *           type: integer
 *           description: Regular overtime hours
 *         weekend_overtime_hours:
 *           type: integer
 *           description: Weekend overtime hours
 *         holiday_overtime_hours:
 *           type: integer
 *           description: Holiday overtime hours
 *         overtime_reason:
 *           type: string
 *           description: Reason for overtime
 *       required:
 *         - overtime_date
 *         - regular_overtime_hours
 *         - weekend_overtime_hours
 *         - holiday_overtime_hours
 *         - overtime_reason
 *
 *     RejectOvertimeRequest:
 *       type: object
 *       properties:
 *         rejection_reason:
 *           type: string
 *           description: Reason for rejecting the overtime request
 *       required:
 *         - rejection_reason
 *
 *     OvertimeResponse:
 *       type: object
 *       properties:
 *         overtime_id:
 *           type: string
 *           description: The ID of the overtime request
 *         employee_id:
 *           type: string
 *           description: The ID of the employee
 *         overtime_date:
 *           type: string
 *           format: date
 *           description: Date of the overtime
 *         regular_overtime_hours:
 *           type: integer
 *           description: Regular overtime hours
 *         weekend_overtime_hours:
 *           type: integer
 *           description: Weekend overtime hours
 *         holiday_overtime_hours:
 *           type: integer
 *           description: Holiday overtime hours
 *         overtime_reason:
 *           type: string
 *           description: Reason for overtime
 *         approved:
 *           type: boolean
 *           description: Approval status
 *         approver_id:
 *           type: string
 *           description: The ID of the approver
 *         rejection_reason:
 *           type: string
 *           description: Reason for rejecting the overtime request
 *       required:
 *         - overtime_id
 *         - employee_id
 *         - overtime_date
 *         - regular_overtime_hours
 *         - weekend_overtime_hours
 *         - holiday_overtime_hours
 *         - overtime_reason
 *         - approved
 *         - approver_id
 */
