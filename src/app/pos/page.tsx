export default function PosPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-12">
      <div className="max-w-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">POS Disabled</h1>
        <p className="text-sm text-slate-600">Point-of-sale functionality has been removed.</p>
      </div>
    </div>
  );
}
                          item.productId,
                          Number(event.target.value)
                        )
                      }
                      className="w-20 rounded-lg border border-slate-200 px-2 py-1 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </td>
                  <td className="px-3 py-2.5 text-base text-slate-500">
                    ${parseFloat(item.price).toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 text-base font-semibold text-slate-800">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => removeItem(item.productId)}
                      className="text-base font-semibold text-rose-600 hover:text-rose-800"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {cart.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-3 py-6 text-center text-sm text-slate-500"
                  >
                    No items in cart. Scan a product to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/60 bg-white/80 p-6 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-md hover:border-slate-300/80 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Totals</h2>
          <p className="text-sm text-slate-500">
            Review subtotal, tax, and grand total before collecting payment.
          </p>
        </div>
        <dl className="space-y-4 text-base">
          <div className="flex items-center justify-between">
            <dt className="text-base text-slate-500">Subtotal</dt>
            <dd className="text-base text-slate-900 font-semibold">
              ${totals.subtotal.toFixed(2)}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-base text-slate-500">
              Tax ({(TAX_RATE * 100).toFixed(0)}%)
            </dt>
            <dd className="text-base text-slate-900 font-semibold">
              ${totals.tax.toFixed(2)}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg">
            <dt className="text-lg font-semibold text-slate-900">Grand Total</dt>
            <dd className="text-lg font-bold text-emerald-600">
              ${totals.total.toFixed(2)}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={completeSale}
          className="w-full inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:scale-[1.02] hover:shadow-indigo-500/30 active:scale-[0.98] py-4 text-base shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed"
          disabled={cart.length === 0}
        >
          Complete Sale &amp; Print Invoice
        </button>
        <p className="text-xs text-slate-400">
          Stock levels update automatically when the sale completes.
        </p>
      </section>
    </div>
  );
}
