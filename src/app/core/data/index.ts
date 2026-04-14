import { cartData } from "./cart";
import { Customers } from "./customer";
import { Orders } from "./order";
import { Products } from "./products";
import { jobcategories } from "./category";

/**
 * Analytic Stat Counder Data
 */
const statData = [
  {
    title: 'Total Earnings',
    value: 559.25,
    icon: 'bx-dollar-circle',
    persantage: '16.24',
    profit: 'up',
    link: 'View net earnings'
  },
  {
    title: 'Orders',
    value: 36894,
    icon: 'bx-shopping-bag',
    persantage: '3.57',
    profit: 'down',
    link: 'View all orders'
  },
  {
    title: 'Customers',
    value: 183.35,
    icon: 'bx-user-circle',
    persantage: '29.08',
    profit: 'up',
    link: 'See details'
  },
  {
    title: 'My Balance',
    value: 165.89,
    icon: 'bx-wallet',
    persantage: '0.00',
    profit: 'equal',
    link: 'Withdraw money'
  }
];

const BestSelling = Products.slice(0, 3);
const TopSelling = Products.slice(0, 3);
const Recentelling = Orders.map(o => ({
    id: o.orderId,
    customer: o.customer,
    product: o.product,
    amount: o.amount,
    status: o.status
}));

export {
    cartData,
    Customers,
    Orders,
    Products,
    statData,
    BestSelling,
    TopSelling,
    Recentelling,
    jobcategories
};
