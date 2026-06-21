import React, { useState } from "react";
import { Search, Tag, Filter, ShoppingCart, DollarSign, Star, Zap } from "lucide-react";

export const MarketplaceApp = () => {
   const [search, setSearch] = useState("");
   
   return (
     <div className="flex flex-col h-full bg-slate-100 text-slate-900 border border-slate-300 rounded-xl overflow-hidden shadow-2xl">
       {/* Marketplace Header */}
       <div className="bg-white px-6 py-4 flex flex-col md:flex-row items-center gap-4 justify-between border-b border-slate-200">
         <div className="flex items-center gap-2">
           <ShoppingCart className="w-6 h-6 text-blue-600" />
           <span className="font-black text-xl tracking-tight text-blue-900">E-MarketHub</span>
         </div>
         
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

         <div className="flex items-center gap-3">
           <button className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition">
             <DollarSign className="w-4 h-4"/> Sell Item
           </button>
           <button className="px-3 py-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition">
             <ShoppingCart className="w-4 h-4"/> Cart
           </button>
         </div>
       </div>

       {/* Horizontal Nav */}
       <div className="bg-white border-b border-slate-200 px-6 py-2 flex items-center gap-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider overflow-x-auto">
         <span className="text-blue-600 border-b-2 border-blue-600 pb-1 cursor-pointer whitespace-nowrap">Daily Deals</span>
         <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition">Electronics</span>
         <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition">Collectibles & Art</span>
         <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition">Fashion</span>
         <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition">Home & Garden</span>
         <span className="hover:text-blue-600 cursor-pointer whitespace-nowrap transition">Sporting Goods</span>
       </div>

       <div className="flex flex-grow overflow-hidden">
         {/* Filters Sidebar */}
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
                  <div className="text-[10px] uppercase font-bold text-slate-400 mb-2">Buying Format</div>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-1"><input type="checkbox" /> Accepts Offers</label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-1"><input type="checkbox" /> Auction</label>
                  <label className="flex items-center gap-2 text-xs font-medium text-slate-700 mb-1"><input type="checkbox" /> Buy It Now</label>
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

         {/* Product Grid */}
         <div className="flex-grow bg-slate-100 p-6 overflow-y-auto">
            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2"><Zap className="text-yellow-500 w-5 h-5"/> Trending Deals</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
               {/* Product Cards */}
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

               <div className="bg-white border text-center border-slate-200 rounded-lg p-3 hover:shadow-xl hover:border-blue-300 transition cursor-pointer group">
                  <div className="aspect-square bg-slate-100 rounded-md mb-3 overflow-hidden flex items-center justify-center p-4">
                     <img src="https://upload.wikimedia.org/wikipedia/commons/e/e0/IBM_Thinkpad_760ED.jpg" alt="ThinkPad" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" />
                  </div>
                  <div className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition truncate">Vintage IBM ThinkPad 760ED</div>
                  <div className="text-xs text-slate-500 mb-2">Used • 3 Bids • 4h left</div>
                  <div className="font-black text-lg text-slate-900">$125.50</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">+$15.00 Shipping</div>
                  <button className="w-full py-1.5 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-700 transition">Place Bid</button>
               </div>
            </div>
         </div>
       </div>
     </div>
   );
};
