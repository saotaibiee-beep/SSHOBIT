import { createClient } from '@supabase/supabase-js';
export const prices:Record<string,number>={deposit_withdrawal:21,p2p_dispute:27,bank_restriction:40};
export const paypalBase='https://api-m.paypal.com';
export function adminDb(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)throw new Error('Database payment configuration missing');
 return createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
}
export async function paypalToken(){
 const id=process.env.PAYPAL_CLIENT_ID,secret=process.env.PAYPAL_CLIENT_SECRET;
 if(!id||!secret)throw new Error('PayPal credentials missing');
 const res=await fetch(paypalBase+'/v1/oauth2/token',{method:'POST',headers:{Authorization:'Basic '+Buffer.from(id+':'+secret).toString('base64'),'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials',cache:'no-store'});
 if(!res.ok)throw new Error('PayPal authentication failed');
 const data=await res.json();return data.access_token as string;
}
export async function paypalRequest(path:string,token:string,method:string,body?:unknown,idempotencyKey?:string){
 const headers:Record<string,string>={Authorization:'Bearer '+token,'Content-Type':'application/json','Prefer':'return=representation'};
 if(idempotencyKey)headers['PayPal-Request-Id']=idempotencyKey;
 const res=await fetch(paypalBase+path,{method,headers,body:body?JSON.stringify(body):undefined,cache:'no-store'});
 const data=await res.json().catch(()=>({}));
 if(!res.ok)throw new Error('PayPal request failed: '+res.status);
 return data;
}
