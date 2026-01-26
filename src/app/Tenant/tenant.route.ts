import express from 'express';
import auth from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { TenantController } from './tenant.controller';
import { USER_ROLE } from '../User/user.constant';
import { createTenantValidation, updateTenantValidation } from './tenant.validation';

const router = express.Router();

router.post(
    '/create-tenant',
    auth(USER_ROLE.superAdmin),
    validateRequest(createTenantValidation),
    TenantController.createTenant,
);

router.get('/', auth(USER_ROLE.admin, USER_ROLE.superAdmin), TenantController.getAllTenants);
router.get('/:tenantId', auth(USER_ROLE.admin, USER_ROLE.superAdmin), TenantController.getSingleTenant);
router.patch('/:tenantId', auth(USER_ROLE.admin, USER_ROLE.superAdmin), validateRequest(updateTenantValidation), TenantController.updateTenant);
router.delete('/:tenantId', auth(USER_ROLE.admin, USER_ROLE.superAdmin), TenantController.deleteTenant);

export const TenantRoutes = router;
