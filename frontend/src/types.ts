export type Role = 'admin' | 'receptionniste' | 'serveur' | 'cuisine' | 'stock_manager'
export type User = { id: number; name: string; email: string; role: Role }
export type RestaurantTable = { id: number; number: number; capacity: number; status: 'free' | 'reserved' | 'occupied' | 'cleaning' }
export type Client = { id: number; name: string; phone: string; email: string }
export type Reservation = {
  id: number; client_id: number; table_id: number | null; reservation_date: string
  reservation_time: string; guests_count: number; status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  client?: Client; table?: RestaurantTable
}
export type Category = { id: number; name: string; description?: string }
export type Dish = { id: number; category_id: number; name: string; description?: string; price: string | number; available: boolean | number; category?: Category }
export type OrderItem = { id: number; order_id: number; dish_id: number; quantity: number; unit_price: string | number; subtotal: string | number; dish?: Dish }
export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'paid' | 'cancelled'
export type Order = { id: number; table_id: number; user_id: number; status: OrderStatus; total_price: string | number; table?: RestaurantTable; user?: User; order_items?: OrderItem[] }
export type Ingredient = { id: number; name: string; unit: string; quantity_available: string | number; alert_threshold: string | number }
export type StockMovement = { id: number; ingredient_id: number; user_id: number; order_id?: number | null; type: 'in' | 'out'; quantity: string | number; reason?: string; ingredient?: Ingredient; user?: User }
