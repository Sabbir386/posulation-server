import { JwtPayload } from "jsonwebtoken";

export interface MyJwtPayload extends JwtPayload {
    objectId: string;
    role: string;
    tenantId?: string | null;
    id: string;
}
