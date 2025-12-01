import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const sales = await prisma.sale.findMany({ include: { soldItems: true }, orderBy: { date: 'desc' } });
    return NextResponse.json(sales);
  } catch (error) {
    console.error('Fetch sales error', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { soldItems, subtotal, tax, totalAmount } = body;
    // Normalize and validate sold items: ensure each references an existing product id
    const normalizedItems: Array<any> = [];
    for (const s of soldItems) {
      let productId = s.productId;
      // If productId is missing or not found, try to resolve by productCode
      if (!productId) {
        if (s.productCode) {
          const prod = await prisma.product.findUnique({ where: { productCode: s.productCode } });
          if (prod) productId = prod.id;
        }
      } else {
        const exists = await prisma.product.findUnique({ where: { id: productId } });
        if (!exists) {
          // try by code
          if (s.productCode) {
            const prod = await prisma.product.findUnique({ where: { productCode: s.productCode } });
            if (prod) productId = prod.id;
          }
        }
      }

      if (!productId) {
        console.error('Product referenced in sale not found', s);
        return NextResponse.json({ error: 'Product not found', item: s }, { status: 400 });
      }

      normalizedItems.push({
        productId,
        productCode: s.productCode,
        name: s.name,
        quantity: Number(s.quantity),
        price: Number(s.price),
      });
    }

    const sale = await prisma.sale.create({
      data: {
        subtotal: Number(subtotal),
        tax: Number(tax),
        totalAmount: Number(totalAmount),
        soldItems: {
          create: normalizedItems.map((s) => ({
            productId: s.productId,
            productCode: s.productCode,
            name: s.name,
            quantity: s.quantity,
            price: s.price,
          })),
        },
      },
      include: { soldItems: true },
    });

    // Adjust stock quantities for each product
    for (const item of soldItems) {
      // decrement by resolved product id (if normalized)
      const idToUse = item.productId || (item.productCode ? (await prisma.product.findUnique({ where: { productCode: item.productCode } }))?.id : undefined);
      if (idToUse) {
        await prisma.product.update({
          where: { id: idToUse },
          data: { stockQuantity: { decrement: Number(item.quantity) } as any },
        });
      }
    }

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error('Record sale error', error);
    return NextResponse.json({ error: 'Failed to record sale' }, { status: 500 });
  }
}
