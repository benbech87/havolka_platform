// Finishes
export type Finish = 'SMOOTH_BLACK' | 'SMOOTH_NICKEL' | 'SMOOTH_BRONZE' | 'SMOOTH_GRAPHITE'

export const FINISH_LABELS: Record<Finish, string> = {
  SMOOTH_BLACK: 'Smooth Black',
  SMOOTH_NICKEL: 'Smooth Nickel',
  SMOOTH_BRONZE: 'Smooth Bronze',
  SMOOTH_GRAPHITE: 'Smooth Graphite',
}

export const FINISH_COLORS: Record<Finish, string> = {
  SMOOTH_BLACK: '#1A1A18',
  SMOOTH_NICKEL: '#B4B4AC',
  SMOOTH_BRONZE: '#6B4A35',
  SMOOTH_GRAPHITE: '#464642',
}

export const FINISH_CODES: Record<Finish, string> = {
  SMOOTH_BLACK: 'MB',
  SMOOTH_NICKEL: 'MSN',
  SMOOTH_BRONZE: 'BRO',
  SMOOTH_GRAPHITE: 'GRA',
}

// Product categories
export type ProductCategory =
  | 'DOOR_LEVER'
  | 'DOOR_KNOB'
  | 'FLUSH_PULL'
  | 'HINGE'
  | 'DOOR_STOP'
  | 'FLUSH_BOLT'
  | 'CABINET_HANDLE'
  | 'ENTRANCE_SET'

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  DOOR_LEVER: 'Door Lever',
  DOOR_KNOB: 'Door Knob',
  FLUSH_PULL: 'Flush Pull',
  HINGE: 'Hinge',
  DOOR_STOP: 'Door Stop',
  FLUSH_BOLT: 'Flush Bolt',
  CABINET_HANDLE: 'Cabinet Handle',
  ENTRANCE_SET: 'Entrance Set',
}

// Door functions
export type DoorFunction = 'PASSAGE' | 'PRIVACY' | 'ENTRANCE' | 'LEVER_ONLY'

export const FUNCTION_LABELS: Record<DoorFunction, string> = {
  PASSAGE: 'Passage Set',
  PRIVACY: 'Privacy Set',
  ENTRANCE: 'Entrance Set',
  LEVER_ONLY: 'Lever Set Only',
}

// Member
export interface Member {
  id: string
  email: string
  firstName: string
  lastName: string
  company: string
  tradeType: string
  status: 'PENDING' | 'PRICING_ACCESS' | 'FULL_ACCESS' | 'SUSPENDED'
  approvedAt?: string
  companyFoundedDate?: string
  merchAddress?: string
  phone?: string
  website?: string
}

// Product
export interface Product {
  id: string
  name: string
  slug: string
  category: ProductCategory
  description?: string
  bodyHtml?: string
  status: string
  skus: Sku[]
  images: ProductImage[]
}

export interface Sku {
  id: string
  sku: string
  finish: Finish
  function?: DoorFunction
  size?: string
  price1_5?: number
  price6_9?: number
  price10plus?: number
  stockLevel: number
}

export interface ProductImage {
  id: string
  url: string
  altText?: string
  position: number
  finish?: Finish
}

// Pricing tiers
export function getPriceForQuantity(sku: Sku, qty: number): number {
  if (qty >= 10 && sku.price10plus) return sku.price10plus
  if (qty >= 6 && sku.price6_9) return sku.price6_9
  return sku.price1_5 || 0
}

// Order
export interface Order {
  id: string
  orderNumber: string
  poNumber?: string
  jobName?: string
  status: string
  total: number
  createdAt: string
  dispatchedAt?: string
  items: OrderItem[]
}

export interface OrderItem {
  id: string
  sku: Sku & { product: Product }
  quantity: number
  unitPrice: number
  total: number
}

// Quote
export interface Quote {
  id: string
  projectName?: string
  poNumber?: string
  status: string
  total: number
  expiresAt?: string
  items: QuoteItem[]
}

export interface QuoteItem {
  id: string
  sku: Sku & { product: Product }
  quantity: number
  unitPrice: number
  total: number
}

// AI Schedule
export interface ScheduleDoor {
  id: string
  type: 'swing' | 'sliding'
  function?: DoorFunction
  handle?: string
  hinges: number
  doorStop: 'Floor Mount' | 'Wall Mount'
  flushPull?: string
  notes?: string
}

export interface ScheduleOutput {
  mode: 'quick' | 'full'
  projectName?: string
  finish: string
  doors: ScheduleDoor[]
  cabinetHandles: Array<{
    style: string
    size: string
    qty: number
    finish: string
  }>
  summary: Array<{
    product: string
    qty: number
    finish: string
    sku: string
  }>
}

// Auth
export interface AuthToken {
  id: string
  email: string
  type: 'member' | 'team'
  role?: string
  status?: string
}
