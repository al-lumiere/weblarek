import { ICustomer, TPayment} from "../../types/index";

export class CustomerInfo {
  private payment: TPayment;
  private email: string;
  private phone: string;
  private address: string;

  constructor (customer: ICustomer = { payment: null, email: "", phone: "", address: "" }) {
    this.payment = customer.payment;
    this.email = customer.email;
    this.phone = customer.phone;
    this.address = customer.address;
  }

  public setCData(data: ICustomer): void {
    this.payment = data.payment;
    this.email = data.email;
    this.phone = data.phone;
    this.address = data.address;
  }
  public setField<T extends keyof ICustomer>(key: T, value: ICustomer[T]): void {
    (this as any)[key] = value;
  }
  public getCData(): ICustomer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    }
  }
  public getField<T extends keyof ICustomer>(key: T): ICustomer[T] {
    return (this as any)[key];
  }
  public clearCustomerInfo(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
  }
  public validateField<T extends keyof ICustomer>(key: T): boolean {
    const value = this.getField(key);
    switch (key) {
      case "payment":
        return value === "Онлайн" || value === "При получении";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value as string);
      case "phone":
        return /^[\d+()\-\s]{7,}$/.test(value as string);
      case "address":
        return (value as string).trim().length > 0;
      default:
        return false;
    }
  }
  public validateCustomer(): {
    payment: boolean;
    email: boolean;
    phone: boolean;
    address: boolean;
    isValid: boolean;
  } {
    const payment = this.validateField("payment");
    const email = this.validateField("email");
    const phone = this.validateField("phone");
    const address = this.validateField("address");
    return { payment, email, phone, address, isValid: payment && email && phone && address };
  }
}