'use client'

import { Order, OrderStatus } from '@/lib/orders-context'
import { Package, CheckCircle, Truck, Home, Clock, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface OrderTrackerProps {
  order: Order
}

export function OrderTracker({ order }: OrderTrackerProps) {
  const getStatusSteps = (): { status: OrderStatus; label: string; icon: React.ReactNode; completed: boolean }[] => {
    const statusOrder: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered']
    const statusLabels: Record<OrderStatus, string> = {
      pending: 'Pending',
      processing: 'Processing',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
    }

    const statusIcons: Record<OrderStatus, React.ReactNode> = {
      pending: <Clock className="w-5 h-5" />,
      processing: <Package className="w-5 h-5" />,
      shipped: <Truck className="w-5 h-5" />,
      delivered: <Home className="w-5 h-5" />,
      cancelled: <AlertCircle className="w-5 h-5" />,
    }

    if (order.status === 'cancelled') {
      return [
        {
          status: 'cancelled',
          label: 'Cancelled',
          icon: statusIcons.cancelled,
          completed: true,
        },
      ]
    }

    const currentIndex = statusOrder.indexOf(order.status as OrderStatus)
    return statusOrder.map((status, index) => ({
      status,
      label: statusLabels[status],
      icon: statusIcons[status],
      completed: index <= currentIndex,
    }))
  }

  const steps = getStatusSteps()
  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Status Badge and Order ID */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Order {order.id}</h3>
          <p className="text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
        <Badge className={`${getStatusColor(order.status)} capitalize`}>
          {order.status}
        </Badge>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.status} className="flex gap-4">
            {/* Icon and Line */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  step.completed
                    ? 'bg-accent text-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-1 h-12 mt-2 ${
                    step.completed ? 'bg-accent' : 'bg-muted'
                  }`}
                ></div>
              )}
            </div>

            {/* Content */}
            <div className="pb-4">
              <p className="font-medium text-foreground">{step.label}</p>
              {index === 0 && order.status !== 'cancelled' && order.estimatedDelivery && (
                <p className="text-sm text-muted-foreground">
                  Estimated:{' '}
                  {new Date(order.estimatedDelivery).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="border-t border-border pt-6 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Items:</span>
          <span className="text-foreground">{order.items.length} item(s)</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total:</span>
          <span className="font-semibold text-foreground">${order.total.toFixed(2)}</span>
        </div>
        {order.trackingNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tracking:</span>
            <span className="font-mono text-foreground">{order.trackingNumber}</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="border-t border-border pt-6 space-y-3">
        <h4 className="font-medium text-foreground">Items in this order</h4>
        <div className="space-y-2">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-foreground">
                {item.productName} × {item.quantity}
              </span>
              <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
