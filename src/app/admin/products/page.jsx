'use client';
import { useState, useEffect, useContext } from 'react';
import toast from 'react-hot-toast';
import Navbar from '@/components/common/Navbar';
import PageBanner from '@/components/common/PageBanner';
import SignInPrompt from '@/components/common/SignInPrompt';
import useAxios from '@/hooks/useAxios';
import { AuthContext } from '@/context/AuthContext';
import { apiError } from '@/utils/pricing';

const PLACEHOLDER = 'https://placehold.co/100x100/EDF0DC/5A6558?text=Item';
const emptyForm = { name: '', category: '', price: '', stock: '', shelfLifeDays: '', description: '', imageUrl: '' };
const inputClass =
  'w-full rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-ink placeholder:text-ink-muted focus:border-olive focus:outline-none focus:ring-4 focus:ring-olive/15';

export default function AdminProducts() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const axios = useAxios();

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    let cancelled = false;
    axios
      .get('/products')
      .then(({ data }) => !cancelled && setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = [...new Set(products.map((p) => p.category))].sort();
  const setField = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await axios.post('/products', {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        shelfLifeDays: Number(formData.shelfLifeDays),
      });
      setProducts((prev) => [...prev, data]);
      toast.success(`${data.name} added to the catalog`);
      setShowForm(false);
      setFormData(emptyForm);
    } catch (error) {
      toast.error(apiError(error, 'Failed to add product'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Navbar wide />
      <main className="mx-auto w-full max-w-[1600px] flex-grow px-5 pb-16 pt-4 lg:px-8 lg:pt-6">
        <PageBanner
          eyebrow="Admin"
          title="Inventory."
          description={`${products.length} products in the catalog. Stock goes down automatically as orders are placed.`}
          image="/images/produce-baskets.jpg"
        >
          {isAdmin && (
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-forest transition-opacity hover:opacity-90"
            >
              {showForm ? 'Cancel' : 'Add a product'}
            </button>
          )}
        </PageBanner>

        {!authLoading && !user ? (
          <SignInPrompt title="Log in as an admin." description="Inventory management is only available to administrators." />
        ) : !authLoading && !isAdmin ? (
          <div className="mt-6 rounded-[2rem] border border-dashed border-line px-6 py-16 text-center">
            <p className="text-xl font-extrabold tracking-tight text-ink">Admins only</p>
            <p className="mt-2 text-ink-muted">Your account does not have access to inventory management.</p>
          </div>
        ) : (
          <>
            {showForm && (
              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 rounded-[1.75rem] border border-line bg-surface p-6 md:grid-cols-3">
                <input placeholder="Product name" required className={inputClass} value={formData.name} onChange={setField('name')} />
                <div>
                  <input
                    placeholder="Category"
                    required
                    list="category-options"
                    className={inputClass}
                    value={formData.category}
                    onChange={setField('category')}
                  />
                  <datalist id="category-options">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <input placeholder="Image URL (optional)" className={inputClass} value={formData.imageUrl} onChange={setField('imageUrl')} />
                <input type="number" min="0" placeholder="Price (৳)" required className={inputClass} value={formData.price} onChange={setField('price')} />
                <input type="number" min="0" placeholder="Stock" required className={inputClass} value={formData.stock} onChange={setField('stock')} />
                <input
                  type="number"
                  min="1"
                  placeholder="Shelf life (days)"
                  required
                  className={inputClass}
                  value={formData.shelfLifeDays}
                  onChange={setField('shelfLifeDays')}
                />
                <textarea
                  placeholder="Description"
                  rows={2}
                  className={`${inputClass} md:col-span-3`}
                  value={formData.description}
                  onChange={setField('description')}
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-primary py-3 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover disabled:opacity-60 md:col-span-3"
                >
                  {saving ? 'Saving...' : 'Save product'}
                </button>
              </form>
            )}

            <section className="mt-6 overflow-hidden rounded-[1.75rem] border border-line bg-surface">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-line text-xs uppercase tracking-[0.14em] text-accent">
                      <th className="px-6 py-4 font-semibold">Product</th>
                      <th className="px-6 py-4 font-semibold">Category</th>
                      <th className="px-6 py-4 text-right font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Stock</th>
                      <th className="px-6 py-4 font-semibold">Shelf life</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-surface-muted">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={product.imageUrl || PLACEHOLDER} alt="" className="h-full w-full object-cover" />
                            </div>
                            <span className="font-medium text-ink">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-ink-muted">{product.category}</td>
                        <td className="px-6 py-3 text-right font-semibold text-ink tabular-nums">৳{product.price}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              product.stock === 0
                                ? 'bg-danger/12 text-danger'
                                : product.stock < 20
                                  ? 'bg-warning/12 text-warning'
                                  : 'bg-success/12 text-success'
                            }`}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-3 text-ink-muted">{product.shelfLifeDays} days</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
