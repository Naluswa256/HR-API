import { Router } from 'express';
import LeaveController from '@/controllers/leave.controller'; // Import the LeaveController
import BaseRoute from '@/interfaces/routes.interface';
import auth from '@/middlewares/auth.middleware';
import validate from '@/middlewares/validation.middleware';
import { approveLeaveSchema, createLeaveSchema, getLeaveByEmployeeSchema, getLeavesByStatusSchema, rejectLeaveSchema } from '@/schemas/leave.validation.schemas';


/**
 * @swagger
 * components:
 *   schemas:
 *     ApproveLeaveRequest:
 *       type: object
 *       required:
 *         - approver_id
 *       properties:
 *         approver_id:
 *           type: string
 *           description: The employee ID of the approver, must start with 'Emp' and be followed by 8 hex characters.
 *           example: "Emp1234abcd"
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     RejectLeaveRequest:
 *       type: object
 *       required:
 *         - approver_id
 *         - rejection_reason
 *       properties:
 *         approver_id:
 *           type: string
 *           description: The employee ID of the approver, must start with 'Emp' and be followed by 8 hex characters.
 *           example: "Emp1234abcd"
 *         rejection_reason:
 *           type: string
 *           description: The reason for rejecting the leave request. Must be at least 5 characters long.
 *           example: "Insufficient leave balance."
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LeaveRequest:
 *       type: object
 *       properties:
 *         leave_type:
 *           type: string
 *           enum: [annual, sick, maternity, paternity, other]
 *           description: Type of the leave.
 *         start_date:
 *           type: string
 *           format: date
 *           description: Start date of the leave (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ).
 *         end_date:
 *           type: string
 *           format: date
 *           description: End date of the leave (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ssZ).
 *         reason:
 *           type: string
 *           description: Reason for taking the leave.
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           description: Status of the leave request.
 *     ApproveLeaveRequest:
 *       type: object
 *       properties:
 *         approver_id:
 *           type: string
 *           description: Employee ID of the approver.
 *     RejectLeaveRequest:
 *       type: object
 *       properties:
 *         approver_id:
 *           type: string
 *           description: Employee ID of the approver.
 *         rejection_reason:
 *           type: string
 *           description: Reason for rejecting the leave request.
 *
 * /leave/submit:
 *   post:
 *     summary: Submit a leave request.
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Leave'
 *     responses:
 *       201:
 *         description: Successfully submitted leave request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Successfully submitted leave request.
 *                 data:
 *                   type: object
 *                   $ref: '#/components/schemas/Leave'
 *
 * /leave/approve/{leaveId}:
 *   post:
 *     summary: Approve a leave request.
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: leaveId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the leave to approve.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApproveLeaveRequest'
 *     responses:
 *       200:
 *         description: Leave request approved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Leave request approved successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Leave'
 *
 * /leave/reject/{leaveId}:
 *   post:
 *     summary: Reject a leave request.
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: leaveId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the leave to reject.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RejectLeaveRequest'
 *     responses:
 *       200:
 *         description: Leave request rejected successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Leave request rejected successfully.
 *                 data:
 *                   $ref: '#/components/schemas/Leave'
 *
 * /leave/status/{status}:
 *   get:
 *     summary: Get all leave requests by status.
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: status
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         description: Status of the leave requests to retrieve.
 *     responses:
 *       200:
 *         description: Successfully retrieved leave requests by status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Leaves retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Leave'
 *
 * /leave/employee/{employee_id}:
 *   get:
 *     summary: Get leave requests for an employee.
 *     tags: [Leave]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: employee_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID to get leave requests for.
 *     responses:
 *       200:
 *         description: Successfully retrieved leave requests for the employee.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Leaves retrieved successfully.
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Leave'
 */






class LeaveRoute extends BaseRoute {
  public path = '/leave'; 

  protected initializeRoutes(): void {
    this.router.post(`/submit`,auth(),validate(createLeaveSchema), LeaveController.submitLeaveRequest); // Submit leave request
    this.router.post(`/approve/:leaveId`, auth('manageUsers'), validate(approveLeaveSchema), LeaveController.approveLeaveRequest);
this.router.post(`/reject/:leaveId`, auth('manageUsers'), validate(rejectLeaveSchema), LeaveController.rejectLeaveRequest);
this.router.get(`/status/:status`, auth('manageUsers'), validate(getLeavesByStatusSchema), LeaveController.getLeavesByStatus);
this.router.get(`/employee/:employee_id`, auth('manageUsers'), validate(getLeaveByEmployeeSchema), LeaveController.getLeaveByEmployee);
  }
}

export default LeaveRoute;
