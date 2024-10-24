import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import UserRoute from './routes/users.route';
import validateEnv from './utils/validateEnv';
import DepartmentRoute from './routes/department.route';
import AttendanceRoute from './routes/attendance.route';
import OvertimeRoute from './routes/overtime.route';
import ShiftRoute from './routes/shift.route';
import LeaveRoute from './routes/leave.route';


validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new UserRoute(), new DepartmentRoute(),
new AttendanceRoute(), new OvertimeRoute(), new ShiftRoute(), new LeaveRoute()]);

app.listen();
