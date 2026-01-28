import { Router } from 'express';
import { UserRoutes } from '../User/user.route';
import { AdminRoutes } from '../Admin/admin.route';
import { AuthRoutes } from '../Auth/auth.route';
import { NormalUserRoutes } from '../NormalUser/normalUser.route';
import { TenantRoutes } from '../Tenant/tenant.route';
import { SupplierRoutes } from '../Supplier/supplier.routes';
import { ProductRoutes } from '../Product/product.routes';
import { CategoryRoutes } from '../Category/category.routes';
import { SubCategoryRoutes } from '../SubCategory/subCategory.routes';
const router = Router();
const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/normalUsers',
    route: NormalUserRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },

  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: "/tenant",
    route: TenantRoutes,
  },
  {
    path: "/supplier",
    route: SupplierRoutes,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/subcategory",
    route: SubCategoryRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
