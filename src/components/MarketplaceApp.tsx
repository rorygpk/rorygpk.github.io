import React, { useState, useEffect } from "react";
import { Search, Tag, Filter, ShoppingCart, DollarSign, Star, Zap, Upload, CreditCard, ArrowRightLeft, CheckCircle2 } from "lucide-react";

export const MarketplaceApp = ({ currentUser }: { currentUser?: any }) => {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"browse" | "sell" | "cart" | "checkout" | "success">("browse");
  const [cart, setCart] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [sellForm, setSellForm] = useState({ title: "", description: "", price: "", condition: "New with tags" });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch("/api/marketplace/items");
      const data = await res.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleList = async () => {
    if (!currentUser) {
      alert("Please login to list items.");
      return;
    }
    try {
      await fetch("/api/marketplace/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sellForm,
          price: parseFloat(sellForm.price),
          seller: currentUser.emailUsername,
          imageUrl: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=500&q=80",
          paymentMethods: ["card", "alipay", "wechat"]
        })
      });
      alert("Item listed successfully!");
      fetchItems();
      setView("browse");
    } catch (e) {
      console.error(e);
    }
  };

  const handleCheckout = async () => {
    if (!currentUser) {
      alert("Please login to checkout.");
      return;
    }
    try {
      await fetch("/api/marketplace/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          buyer: currentUser.emailUsername,
          total: cart.reduce((a, b) => a + b.price, 0) + 15,
          paymentMethod: "card"
        })
      });
      setCart([]);
      setView("success");
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const MAX_SIZE = 5 * 1024 * 1024 * 1024; // 5GB
    if (file.size > MAX_SIZE) {
      alert("文件大小超过 5GB 限制。");
      return;
    }
    setUploadedFileName(file.name);
  };
   
   return (
     <div className="flex flex-col h-full bg-slate-100 text-slate-900 border border-slate-300 rounded-xl overflow-hidden shadow-2xl">
       {/* Marketplace Header */}
       <div className="bg-white px-6 py-4 flex flex-col md:flex-row items-center gap-4 justify-between border-b border-slate-200">
         <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView("browse")}>
           <ShoppingCart className="w-6 h-6 text-blue-600" />
           <span className="font-black text-xl tracking-tight text-blue-900">E-MarketHub</span>
         </div>
         
         {view === "browse" && (
           <div className="flex-grow max-w-xl relative">
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search for anything (e.g., 'MacBook Pro', 'Vintage Camera')..."
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="w-full pl-10 pr-4 py-2 border-2 border-slate-200 rounded-full bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 transition text-sm font-medium"
             />
             <button className="absolute right-1 top-1 bottom-1 bg-blue-600 text-white px-4 rounded-full text-xs font-bold hover:bg-blue-700 transition">Search</button>
           </div>
         )}

         <div className="flex items-center gap-3">
           <button onClick={() => setView("sell")} className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition">
             <DollarSign className="w-4 h-4"/> Sell Item
           </button>
           <button onClick={() => setView("cart")} className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition relative">
             <ShoppingCart className="w-4 h-4"/> Cart
             {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{cart.length}</span>}
           </button>
         </div>
       </div>

       {view === "browse" && (
         <>
           <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider overflow-x-auto">
             <span className="text-blue-600 border-b-2 border-blue-600 pb-1 cursor-pointer whitespace-nowrap">Daily Deals</span>
             <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition">Electronics</span>
             <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition">Collectibles & Art</span>
             <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition">Fashion</span>
             <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition">Home & Garden</span>
             <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition">Sporting Goods</span>
           </div>

           <div className="flex flex-grow overflow-hidden">
             <div className="w-48 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 p-4 overflow-y-auto hidden md:flex">
                <div className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2"><Filter className="w-4 h-4" /> Filters</div>
                <div className="space-y-4">
                   <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Condition</div>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-1"><input type="checkbox" /> New</label>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-1"><input type="checkbox" /> Used</label>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-1"><input type="checkbox" /> Refurbished</label>
                   </div>
                   <div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Price</div>
                      <div className="flex gap-2">
                         <input type="text" placeholder="$ Min" className="w-full text-xs p-1.5 border border-slate-300 rounded" />
                         <input type="text" placeholder="$ Max" className="w-full text-xs p-1.5 border border-slate-300 rounded" />
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex-grow bg-slate-100 p-6 overflow-y-auto">
                <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Zap className="text-yellow-500 w-5 h-5"/> Trending Deals</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                   <div className="bg-white border text-center border-slate-200 rounded-lg p-3 hover:shadow-xl hover:border-blue-300 transition cursor-pointer group">
                      <div className="aspect-square bg-slate-100 rounded-md mb-3 overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=600&q=80" alt="Watch" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition truncate">Apple Watch Series 8 GPS</div>
                      <div className="text-xs text-slate-500 mb-2">Used - Like New • Seller: TechFlip</div>
                      <div className="font-black text-lg text-slate-900">$249.99</div>
                      <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider mb-2">Free Delivery</div>
                      <button className="w-full py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition">Buy It Now</button>
                   </div>
                   <div className="bg-white border text-center border-slate-200 rounded-lg p-3 hover:shadow-xl hover:border-blue-300 transition cursor-pointer group">
                      <div className="aspect-square bg-slate-100 rounded-md mb-3 overflow-hidden">
                         <img src="https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?auto=format&fit=crop&w=600&q=80" alt="iPhone" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                      <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition truncate">iPhone 13 Pro Max - 256GB</div>
                      <div className="text-xs text-slate-500 mb-2">Refurbished • Seller: GadgetHub</div>
                      <div className="font-black text-lg text-slate-900">$680.00</div>
                      <div className="text-[10px] text-red-500 font-bold uppercase tracking-wider mb-2 text-left flex justify-center"><Star className="w-3 h-3 inline mr-1 text-yellow-400"/> Top Rated Plus</div>
                      <button className="w-full py-1.5 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition">Buy It Now</button>
                   </div>
                </div>
             </div>
           </div>
         </>
       )}

       {view === "sell" && (
         <div className="flex-grow bg-slate-50 p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
               <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><Upload className="text-blue-500"/> List an Item for Sale</h2>
               <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Title</label>
                    <input type="text" placeholder="e.g. Vintage Camera Lens 50mm" className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Price ($)</label>
                      <input type="number" placeholder="0.00" className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Condition</label>
                      <select className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
                        <option>New with tags</option>
                        <option>Used - Excellent</option>
                        <option>Used - Good</option>
                        <option>For parts or not working</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">上传照片</label>
                    <label 
                      className={`block border-2 border-dashed ${isDraggingFile ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50'} rounded-xl p-8 text-center cursor-pointer hover:bg-slate-100 transition`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                       <Upload className={`w-8 h-8 mx-auto mb-2 ${isDraggingFile ? 'text-blue-500' : 'text-slate-400'}`} />
                       <span className="text-sm font-medium text-slate-600">
                         {uploadedFileName ? `已准备就绪: ${uploadedFileName}` : "拖放照片或点击浏览"}
                       </span>
                       <p className="text-xs text-slate-400 mt-1">支持高达 5GB 的文件</p>
                       <input type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                  <button onClick={() => { alert("Item listed successfully!"); setView("browse"); }} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition text-lg mt-4">List Item</button>
               </div>
            </div>
         </div>
       )}

       {view === "cart" && (
         <div className="flex-grow bg-slate-50 p-8 overflow-y-auto">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
               <div className="md:col-span-2 space-y-4">
                 <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2"><ShoppingCart /> Your Cart</h2>
                 {cart.map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4">
                       <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/IBM_Thinkpad_760ED.jpg" className="w-16 mix-blend-multiply" alt="item" />
                       </div>
                       <div className="flex-grow">
                         <h3 className="font-bold text-slate-800">{item.title}</h3>
                         <div className="text-sm text-slate-500">Condition: Used</div>
                         <button onClick={() => setCart([])} className="text-xs text-red-500 hover:underline mt-2">Remove</button>
                       </div>
                       <div className="font-black text-xl">${item.price.toFixed(2)}</div>
                    </div>
                 ))}
                 {cart.length === 0 && <div className="text-center p-8 text-slate-500 bg-white rounded-xl border border-slate-200">Your cart is empty.</div>}
                 
                 <div className="bg-white border border-slate-200 p-4 rounded-xl mt-6">
                    <h3 className="font-bold text-sm text-slate-800 mb-2 flex items-center gap-2"><ArrowRightLeft className="w-4 h-4 text-blue-500"/> Order Transfer Request</h3>
                    <p className="text-xs text-slate-500 mb-3">You can securely transfer this order and its payment responsibility to another user in your network.</p>
                    <div className="flex gap-2">
                       <input type="text" placeholder="Recipient Username or Email" className="flex-grow p-2 text-xs border border-slate-200 rounded" />
                       <button onClick={() => alert("Transfer request sent.")} className="px-4 bg-slate-800 text-white rounded text-xs font-bold">Transfer Order</button>
                    </div>
                 </div>
               </div>

               <div className="bg-white border border-slate-200 rounded-xl p-6 h-fit">
                 <h3 className="font-black text-lg mb-4 border-b border-slate-100 pb-2">Summary</h3>
                 <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex justify-between"><span>Subtotal</span><span>${cart.reduce((a,b)=>a+b.price, 0).toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Shipping</span><span>$15.00</span></div>
                    <div className="flex justify-between font-black text-slate-900 text-lg pt-2 border-t border-slate-100 mt-2">
                       <span>Total</span><span>${(cart.reduce((a,b)=>a+b.price, 0) + 15).toFixed(2)}</span>
                    </div>
                 </div>
                 <button disabled={cart.length === 0} onClick={() => setView("checkout")} className="w-full py-3 bg-blue-600 disabled:bg-slate-300 hover:bg-blue-700 text-white font-bold rounded-xl transition">Proceed to Checkout</button>
               </div>
            </div>
         </div>
       )}

       {view === "checkout" && (
         <div className="flex-grow bg-slate-50 p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
               <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2"><CreditCard className="text-blue-500"/> Secure Checkout</h2>
               <div className="space-y-6">
                 <div>
                   <h3 className="font-bold text-sm uppercase tracking-wider text-slate-500 mb-3">Select Payment Method</h3>
                   <div className="grid grid-cols-3 gap-3">
                      <button className="border-2 border-blue-600 bg-blue-50 p-4 rounded-xl font-bold flex flex-col items-center gap-2 text-blue-900">
                         <span className="text-xl font-black italic tracking-tighter">VISA</span>
                         <span className="text-[10px] uppercase">Credit/Debit</span>
                      </button>
                      <button className="border border-slate-200 hover:border-blue-400 p-4 rounded-xl font-bold flex flex-col items-center gap-2 text-slate-700 transition">
                         <span className="text-xl font-black tracking-tighter text-blue-500">Alipay</span>
                         <span className="text-[10px] uppercase text-slate-400">支付宝</span>
                      </button>
                      <button className="border border-slate-200 hover:border-green-500 p-4 rounded-xl font-bold flex flex-col items-center gap-2 text-slate-700 transition">
                         <span className="text-xl font-black tracking-tighter text-green-500">WeChat</span>
                         <span className="text-[10px] uppercase text-slate-400">微信支付</span>
                      </button>
                   </div>
                 </div>
                 
                 <div className="space-y-3">
                   <input type="text" placeholder="Card Number" className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                   <div className="grid grid-cols-2 gap-3">
                     <input type="text" placeholder="MM/YY" className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                     <input type="text" placeholder="CVC" className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500" />
                   </div>
                 </div>

                 <button onClick={() => { setCart([]); setView("success"); }} className="w-full py-4 bg-slate-900 hover:bg-black text-white font-black rounded-xl transition text-lg mt-4 shadow-xl">
                   Pay ${(cart.reduce((a,b)=>a+b.price, 0) + 15).toFixed(2)}
                 </button>
               </div>
            </div>
         </div>
       )}

       {view === "success" && (
         <div className="flex-grow bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
               <CheckCircle2 className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">Payment Successful!</h2>
            <p className="text-slate-500 max-w-md mb-8">Your order has been placed and is being processed by the merchant. Order receipt sent to your associated secure email.</p>
            <button onClick={() => setView("browse")} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition">Return to Marketplace</button>
         </div>
       )}
     </div>
   );
};
