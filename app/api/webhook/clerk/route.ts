// app/api/webhook/clerk/route.ts
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { createUser, updateUser, deleteUser } from '@/API/user';
import { getCurrentUserId } from '@/config/token';

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
if (!CLERK_WEBHOOK_SECRET) {
  console.warn('CLERK_WEBHOOK_SECRET is not set. Webhook verification will fail.');
}

export async function POST(req: Request) {
  // Read raw text (exact payload required for signature verification)
  const payload = await req.text();

  // Collect Svix headers that Clerk uses
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id') ?? '',
    'svix-timestamp': req.headers.get('svix-timestamp') ?? '',
    'svix-signature': req.headers.get('svix-signature') ?? '',
  };

  const userId = getCurrentUserId()
  // Verify signature using svix
  const wh = new Webhook(CLERK_WEBHOOK_SECRET);
  let evt: any;
  try {
    evt = wh.verify(payload, svixHeaders);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // evt is the parsed event. shape: { id, type, data, ... }
  try {
    const type: string = evt.type;
    const data = evt.data;

    if (type === 'user.created') {
      const user = data;
      const userData = {
        clerkId: user.id,
        email: user.primary_email_address?.email_address ?? null,
        firstName: user.first_name ?? null,
        lastName: user.last_name ?? null,
        role: user.public_metadata?.role ?? 'user',
        name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
        username: user.username ?? undefined,
        avatar: user.image_url ?? null,
      };

      // createUser should be idempotent (or check existence inside)
      await createUser(userData);
      return NextResponse.json({ message: 'user.created handled' }, { status: 201 });
    }

    if (type === 'user.updated') {
      const user = data;
      const updateData = {
        clerkId: user.id,
        email: user.primary_email_address?.email_address ?? undefined,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.public_metadata?.role,
        name: `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim(),
        username: user.username ?? undefined,
        avatar: user.image_url ?? undefined,
      };

      await updateUser(userId!, updateData);
      return NextResponse.json({ message: 'user.updated handled' }, { status: 200 });
    }

    if (type === 'user.deleted') {
      const user = data;
      await deleteUser(userId!);
      return NextResponse.json({ message: 'user.deleted handled' }, { status: 200 });
    }

    // Unhandled event type
    return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
  } catch (err) {
    console.error('Error processing webhook event:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



// // coding_platform_Frontend/app/api/webhook/clerk/route.ts
// import { NextResponse } from 'next/server';
// import { createUser } from '@/API/user';

// // Use proper server-side environment variable (not NEXT_PUBLIC_)
// const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

// export async function POST(req: Request) {
//   const headers = req.headers;
//   const signature = headers.get('clerk-signature'); // Webhook signature for verification
//   const body = await req.json();

//   // Verify the webhook signature (Recommended)
//   if (!signature || !CLERK_WEBHOOK_SECRET || signature !== CLERK_WEBHOOK_SECRET) {
//     console.error('Webhook verification failed:', { signature: !!signature, secret: !!CLERK_WEBHOOK_SECRET });
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   if (body.type === 'user.created') {
//     const user = body.data;

//     console.log('Received webhook payload:', user);

//     const userData = {
//       clerkId: user.id,
//       email: user.primary_email_address.email_address,
//       firstName: user.first_name,
//       lastName: user.last_name,
//       role: user.public_metadata?.role ?? 'user',
//       name: `${user.first_name || ''} ${user.last_name || ''}`.trim(),
//       username: user.username === null ? undefined : user.username,
//       avatar: user.image_url
//     };

//     try {
//       await createUser(userData);
//       return NextResponse.json({ message: 'User created successfully' },  { status: 201 });
//     } catch (error) {
//       console.error('Error creating user:', error);
//       return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//     }
//   }

//   return NextResponse.json({ message: 'Event ignored' }, { status: 200 });
// }




// // import { headers } from 'next/headers';
// // import { WebhookEvent } from '@clerk/nextjs/server';
// // import { createUser } from '@/API/user';
// // import { Webhook } from 'svix';

// // export async function POST(req: Request) {
// //   try {
// //     // Get the headers
// //     const headerPayload = await headers();
// //     const svix_id = headerPayload.get("svix-id");
// //     const svix_timestamp = headerPayload.get("svix-timestamp");
// //     const svix_signature = headerPayload.get("svix-signature");

// //     console.log('Received webhook headers:', { svix_id, svix_timestamp, svix_signature });

// //     // If there are no headers, error out
// //     if (!svix_id || !svix_timestamp || !svix_signature) {
// //       console.error('Missing svix headers');
// //       return new Response('Error occurred -- no svix headers', {
// //         status: 400
// //       });
// //     }

// //     // Get the body
// //     const payload = await req.json();
// //     console.log('Received webhook payload:', payload);
// //     const body = JSON.stringify(payload);

// //     // Create a new Svix instance with your webhook secret
// //     const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
// //     if (!webhookSecret) {
// //       console.error('CLERK_WEBHOOK_SECRET is not set');
// //       return new Response('Server configuration error', { status: 500 });
// //     }

// //     const wh = new Webhook(webhookSecret);

// //     let evt: WebhookEvent;

// //     // Verify the webhook
// //     try {
// //       evt = wh.verify(body, {
// //         "svix-id": svix_id,
// //         "svix-timestamp": svix_timestamp,
// //         "svix-signature": svix_signature,
// //       }) as WebhookEvent;
// //       console.log('Webhook verified successfully');
// //     } catch (err) {
// //       console.error('Error verifying webhook:', err);
// //       return new Response('Error occurred during verification', {
// //         status: 400
// //       });
// //     }

// //     // Handle the webhook
// //     const eventType = evt.type;
// //     console.log('Event type:', eventType);
    
// //     if (eventType === 'user.created') {
// //       const { id, email_addresses, first_name, last_name, unsafe_metadata, username, image_url } = evt.data;
      
// //       const userData = {
// //         clerkId: id,
// //         email: email_addresses[0]?.email_address || undefined,
// //         firstName: first_name || undefined,
// //         lastName: last_name || undefined,
// //         role: (unsafe_metadata?.role as string) || 'user',
// //         name: `${first_name || ''} ${last_name || ''}`.trim(),
// //         username: username === null ? undefined : username,
// //         avatar: image_url
// //       };

// //       try {
// //         console.log('Attempting to create user with data:', userData);
// //         const user = await createUser(userData);
// //         console.log('User created successfully:', user);
// //         return new Response(JSON.stringify({ success: true, user }), { 
// //           status: 200,
// //           headers: { 'Content-Type': 'application/json' }
// //         });
// //       } catch (error) {
// //         console.error('Error creating user:', error);
// //         return new Response(JSON.stringify({ 
// //           success: false, 
// //           error: error instanceof Error ? error.message : 'Error creating user'
// //         }), { 
// //           status: 500,
// //           headers: { 'Content-Type': 'application/json' }
// //         });
// //       }
// //     }

// //     return new Response(JSON.stringify({ success: true, message: 'Webhook processed' }), { 
// //       status: 200,
// //       headers: { 'Content-Type': 'application/json' }
// //     });
// //   } catch (error) {
// //     console.error('Unexpected error in webhook handler:', error);
// //     return new Response(JSON.stringify({ 
// //       success: false, 
// //       error: error instanceof Error ? error.message : 'Internal server error' 
// //     }), { 
// //       status: 500,
// //       headers: { 'Content-Type': 'application/json' }
// //     });
// //   }
// // } 
