import { Supplier } from "./supplier.model";

export const generateSupplierId = async (): Promise<string> => {
  const last = await Supplier.findOne({}, { supplierId: 1 }).sort({ supplierId: -1 }).lean();
  if (!last) return "s-001";

  const lastNumber = parseInt(last.supplierId.split("-")[1]);
  const newNumber = lastNumber + 1;

  return `s-${newNumber.toString().padStart(3, "0")}`;
};
