import { Router } from 'express';
import { UserRoutes } from '../User/user.route';
import { AdminRoutes } from '../Admin/admin.route';
import { AuthRoutes } from '../Auth/auth.route';
import { NormalUserRoutes } from '../NormalUser/normalUser.route';
import { TenantRoutes } from '../Tenant/tenant.route';
import { SupplierRoutes } from '../Supplier/supplier.routes';

import { CategoryRoutes } from '../Category/category.routes';
import { SubCategoryRoutes } from '../SubCategory/subCategory.routes';
import { BrandRoutes } from '../Brand/brand.routes';
import { UnitRoutes } from '../Unit/unit.routes';
import { VariantAttributeRoutes } from '../VariantAttribute/variantAttribute.routes';
import { WarrantyRoutes } from '../Warranties/warranty.routes';
import { StoreRoutes } from '../Store/store.routes';
import { WarehouseRoutes } from '../Warehouse/warehouse.routes';
import { ProductRoutes } from '../Product/product.routes';
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
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/sub-category",
    route: SubCategoryRoutes,
  },
  {
    path: "/brand",
    route: BrandRoutes,
  },
  {
    path: "/unit",
    route: UnitRoutes,
  },
  {
    path: "/variant-attribute",
    route: VariantAttributeRoutes,
  },
  {
    path: "/warranty",
    route: WarrantyRoutes
    ,
  },
  {
    path: "/store",
    route: StoreRoutes
    ,
  },
  {
    path: "/warehouse",
    route: WarehouseRoutes
    ,
  },
  {
    path: "/product",
    route: ProductRoutes
    ,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
