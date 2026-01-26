import { Counter } from './counter.model';
import { User } from './user.model';

const START_USER_ID = 47373; // Starting ID

export const findLastAdminId = async (): Promise<string | undefined> => {
  const lastAdmin = await User.findOne(
    { role: 'admin' },
    { id: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const findLastAdvertiserId = async (): Promise<string | undefined> => {
  const lastAdvertiser = await User.findOne(
    { role: 'advertiser' },
    { id: 1, _id: 0 }
  )
    .sort({ createdAt: -1 })
    .lean();

  return lastAdvertiser?.id ? lastAdvertiser.id.substring(2) : undefined;
};

export const findLastUserId = async (): Promise<number | undefined> => {
  const lastUser = await User.findOne(
    { role: 'user' },
    { id: 1, _id: 0 }
  )
    .sort({ id: -1 })
    .lean();

  return lastUser?.id ? parseInt(lastUser.id, 10) : undefined;
};

export const generateUserId = async (): Promise<string> => {
  let currentId = START_USER_ID - 1;
  const lastId = await findLastUserId();

  if (lastId && lastId >= START_USER_ID) {
    currentId = lastId;
  }

  const incrementId = (currentId + 1).toString();
  return incrementId;
};

export const generateAdminId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'admin' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const incrementId = counter!.value.toString().padStart(4, '0');
  return `A-${incrementId}`;
};

export const generateAdvertiserId = async (): Promise<string> => {
  const counter = await Counter.findOneAndUpdate(
    { name: 'advertiser' },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );

  const incrementId = counter!.value.toString().padStart(4, '0');
  return `AD-${incrementId}`;
};

const TENANT_PREFIX = "t-";
const TENANT_PAD = 4;
const TENANT_START = 2; // first should be t-0002

// safest: parse numeric part, ignore junk like "t-default"
export const getLastTenantNumberFromUsers = async (): Promise<number | null> => {
  const last = await User.findOne(
    { tenantId: { $regex: /^t-\d{4}$/ } }, // only t-0002 format
    { tenantId: 1, _id: 0 }
  )
    .sort({ tenantId: -1 }) // works because fixed-width padded (t-0002)
    .lean();

  if (!last?.tenantId) return null;

  const n = Number(last.tenantId.replace(TENANT_PREFIX, ""));
  return Number.isFinite(n) ? n : null;
};

 const generateTenantIdFromUsers = async (): Promise<string> => {
  const lastNo = await getLastTenantNumberFromUsers();
  const nextNo = (lastNo ?? (TENANT_START - 1)) + 1; // null => 2

  return `${TENANT_PREFIX}${String(nextNo).padStart(TENANT_PAD, "0")}`;
};
// Ensure all functions are properly exported
export {
  generateUserId as generateid,
  generateTenantIdFromUsers,
};

