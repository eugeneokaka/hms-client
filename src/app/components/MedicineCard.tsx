import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type Medicine = {
  name: string;
  category: string;
  manufacturer: string;
  quantity: number;
  price: number;
  expiryDate: string | Date;
  order?: {
    supplier: string;
    orderNumber: string | number;
  };
};
export default function MedicineCard({ medicine }: { medicine: Medicine }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{medicine.name}</CardTitle>
        <p className="text-sm text-muted-foreground">{medicine.category}</p>
      </CardHeader>
      <CardContent className="text-sm space-y-1">
        <p>
          <strong>Manufacturer:</strong> {medicine.manufacturer}
        </p>
        <p>
          <strong>Qty:</strong> {medicine.quantity}
        </p>
        <p>
          <strong>Price:</strong> ${medicine.price.toFixed(2)}
        </p>
        <p>
          <strong>Expires:</strong>{" "}
          {new Date(medicine.expiryDate).toDateString()}
        </p>
        {medicine.order && (
          <p className="text-xs text-muted-foreground">
            From {medicine.order.supplier} (Order #{medicine.order.orderNumber})
          </p>
        )}
      </CardContent>
    </Card>
  );
}
