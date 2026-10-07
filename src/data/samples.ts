export interface CodeSample {
  id: string;
  name: string;
  language: string;
  category: string;
  description: string;
  context: string;
  code: string;
}

export const SAMPLE_CODES: CodeSample[] = [
  {
    id: 'auth-race-security',
    name: 'Auth Middleware & User Session (TypeScript/Node)',
    language: 'typescript',
    category: 'Security & Race Condition',
    description: 'Express middleware handling JWT tokens, DB queries with SQL injection vulnerability, and unhandled async race condition.',
    context: 'Migrating legacy session middleware to JWT with role-based checks for user profile updates.',
    code: `import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from './database';

// Global cache for sessions - vulnerable to memory leak and concurrent race condition
const sessionCache: Record<string, any> = {};

export async function authAndChargeMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).send("No token"); // Missing standard JSON response
  }

  try {
    // SECURITY RISK: Weak secret fallback and unverified payload
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
    
    // SECURITY RISK: SQL Injection via unsanitized string interpolation
    const userQuery = \`SELECT * FROM users WHERE id = '\${decoded.userId}' AND active = 1\`;
    const user = await db.raw(userQuery);

    if (!user || user.length === 0) {
      return res.status(403).json({ error: 'User inactive' });
    }

    // RACE CONDITION & MEMORY LEAK: In-memory mutation without lock
    if (sessionCache[decoded.userId]) {
      sessionCache[decoded.userId].lastAccess = Date.now();
      sessionCache[decoded.userId].requestCount++;
    } else {
      sessionCache[decoded.userId] = {
        lastAccess: Date.now(),
        requestCount: 1,
        balance: user[0].wallet_balance
      };
    }

    // PERFORMANCE BOTTLENECK: Synchronous heavy operation on main event loop
    const now = Date.now();
    while (Date.now() - now < 50) {
      // simulate artificial crypto block
    }

    req.user = user[0];
    next();
  } catch (err: any) {
    // ERROR MASKING: Swallows exact error and leaks internal server stack
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}

export async function transferFunds(req: Request, res: Response) {
  const { recipientId, amount } = req.body;
  const senderId = req.user.id;

  // BUG: Floating point currency math without transaction rollback
  const senderSession = sessionCache[senderId];
  if (senderSession.balance >= amount) {
    senderSession.balance = senderSession.balance - amount;

    // RACE CONDITION: Double spend possible during async delay
    await db.raw(\`UPDATE users SET wallet_balance = wallet_balance - \${amount} WHERE id = '\${senderId}'\`);
    await db.raw(\`UPDATE users SET wallet_balance = wallet_balance + \${amount} WHERE id = '\${recipientId}'\`);

    res.json({ success: true, newBalance: senderSession.balance });
  } else {
    res.status(400).json({ error: 'Insufficient funds' });
  }
}`
  },
  {
    id: 'react-memory-leak',
    name: 'Real-time Telemetry Dashboard (React/TS)',
    language: 'typescript',
    category: 'Performance & Memory Leak',
    description: 'React component with missing cleanup in useEffect, stale closure, infinite re-render hazard, and unmemoized calculations.',
    context: 'High-frequency telemetry live graph component monitoring cluster health.',
    code: `import React, { useState, useEffect } from 'react';

interface MetricPoint {
  timestamp: number;
  cpu: number;
  memory: number;
  requests: number;
}

export function ClusterMetricsViewer({ clusterId }: { clusterId: string }) {
  const [metrics, setMetrics] = useState<MetricPoint[]>([]);
  const [filterThreshold, setFilterThreshold] = useState<number>(80);
  const [isAlerting, setIsAlerting] = useState<boolean>(false);

  // BUG: Missing cleanup on WebSocket and stale closure in metrics accumulator
  useEffect(() => {
    const ws = new WebSocket(\`wss://api.cloud.corp/stream/\${clusterId}\`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      // STALE CLOSURE & PERFORMANCE: Creating new array on every rapid WS event
      // Also unbounded growth causes tab crash (memory leak)
      metrics.push(data);
      setMetrics([...metrics]);

      // INFINITE RENDER HAZARD: Updating state unconditionally based on stale prop
      if (data.cpu > filterThreshold) {
        setIsAlerting(true);
      }
    };

    window.addEventListener('resize', () => {
      console.log('Window resized for cluster:', clusterId);
    });

    // CRITICAL BUG: No ws.close() and no window.removeEventListener cleanup!
  }, []); // BUG: Missing clusterId and filterThreshold in dependency array

  // PERFORMANCE: Heavy recalculation running on EVERY render without useMemo
  const criticalSpikes = metrics.filter(m => {
    let sum = 0;
    for (let i = 0; i < 100000; i++) {
      sum += Math.sqrt(i);
    }
    return m.cpu > filterThreshold && sum > 0;
  });

  return (
    <div className="metrics-panel">
      <h2>Cluster Health: {clusterId} {isAlerting && <span className="badge">ALERT</span>}</h2>
      <input 
        type="number" 
        value={filterThreshold} 
        onChange={(e) => setFilterThreshold(Number(e.target.value))} 
      />
      <div>Total Data Points: {metrics.length}</div>
      <div>Critical Events: {criticalSpikes.length}</div>
      <ul>
        {metrics.slice(-10).map((m, idx) => (
          // ANTI-PATTERN: Using array index as key for dynamically shifting items
          <li key={idx}>CPU: {m.cpu}% | MEM: {m.memory}%</li>
        ))}
      </ul>
    </div>
  );
}`
  },
  {
    id: 'python-payment-webhook',
    name: 'Stripe Webhook & Order Dispatch (Python/FastAPI)',
    language: 'python',
    category: 'Architecture & Security',
    description: 'FastAPI payment webhook with unverified signature, missing idempotency key, float currency arithmetic, and raw exception suppression.',
    context: 'Core payment processing endpoint handling merchant settlements.',
    code: `import json
import sqlite3
from fastapi import FastAPI, Request, HTTPException
import requests

app = FastAPI()

DATABASE_URL = "production_orders.db"

@app.post("/webhook/stripe-checkout")
async def stripe_webhook(request: Request):
    # SECURITY RISK: Reading raw body without verifying stripe signature header
    payload = await request.body()
    event_data = json.loads(payload.decode('utf-8'))
    
    event_type = event_data.get("type")
    data_object = event_data.get("data", {}).get("object", {})
    
    if event_type == "payment_intent.succeeded":
        order_id = data_object.get("metadata", {}).get("order_id")
        # BUG: Floating point representation of monetary cents causes loss of precision
        amount_paid = float(data_object.get("amount", 0)) / 100.0

        conn = sqlite3.connect(DATABASE_URL)
        cursor = conn.cursor()

        # ARCHITECTURAL FLAW: Missing idempotency check. Duplicate webhooks double-fulfill orders!
        cursor.execute(f"UPDATE orders SET status = 'PAID', paid_amount = {amount_paid} WHERE order_id = '{order_id}'")
        conn.commit()

        # SCALABILITY BOTTLENECK: Synchronous blocking HTTP call to logistics partner inside request thread
        try:
            dispatch_response = requests.post(
                "https://logistics.partner-api.internal/v1/shipments",
                json={"orderId": order_id, "priority": "EXPEDITED"},
                timeout=30 # Blocking worker for up to 30 seconds
            )
            dispatch_data = dispatch_response.json()
        except Exception:
            # BUG: Silently suppressing logistics failure leads to paid orders never shipping
            pass

        # SECURITY: Logging sensitive customer credit card snippet or customer metadata to stdout
        print(f"DEBUG: Processed payment for order {order_id} with customer details: {data_object}")

        conn.close()
        return {"status": "success"}

    return {"status": "ignored"}`
  },
  {
    id: 'go-concurrency-leak',
    name: 'Concurrent Batch Processor (Go)',
    language: 'go',
    category: 'Concurrency & Deadlock',
    description: 'Go batch processor with unbounded goroutine spawning, unbuffered channel deadlock hazard, missing context timeout, and data race.',
    context: 'High-throughput ingestion worker handling customer analytics events.',
    code: `package main

import (
	"context"
	"fmt"
	"net/http"
	"sync"
	"time"
)

type Event struct {
	ID        string
	Payload   string
	Retries   int
}

// BUG: Global unprotected state accessed concurrently
var totalProcessed int

func ProcessBatch(events []Event) ([]string, error) {
	// DEADLOCK HAZARD: Unbuffered channel with no consumer loop control
	resultChan := make(chan string)
	var wg sync.WaitGroup

	for _, event := range events {
		wg.Add(1)
		
		// CONCURRENCY BUG 1: Loop variable capture race in older Go versions
		// CONCURRENCY BUG 2: Unbounded goroutine creation (OOM if batch has 100,000 events)
		go func() {
			defer wg.Done()

			// RACE CONDITION: Non-atomic increment on shared global integer
			totalProcessed++

			// MISSING CONTEXT / TIMEOUT: Can hang forever on slow upstream
			resp, err := http.Post("https://analytics.backend.net/events", "application/json", nil)
			if err != nil {
				// BUG: If channel buffer is full or no reader ready, goroutine hangs forever (Goroutine leak)
				resultChan <- fmt.Sprintf("FAILED:%s", event.ID)
				return
			}
			defer resp.Body.Close()

			resultChan <- fmt.Sprintf("OK:%s", event.ID)
		}()
	}

	// DEADLOCK: Calling wg.Wait() on same thread before reading from unbuffered resultChan
	wg.Wait()
	close(resultChan)

	var results []string
	for res := range resultChan {
		results = append(results, res)
	}

	return results, nil
}`
  },
  {
    id: 'sql-orm-nplusone',
    name: 'E-Commerce Order Catalog Query (SQL/Node)',
    language: 'javascript',
    category: 'Performance & Scalability',
    description: 'Catastrophic N+1 database queries, uncapped limit loading 500,000 rows into memory, and missing indexed lookups.',
    context: 'Customer order history dashboard API endpoint.',
    code: `const express = require('express');
const router = express.Router();
const { pool } = require('./db');

router.get('/api/orders/history', async (req, res) => {
  const userId = req.query.userId;
  
  try {
    // PERFORMANCE BOTTLENECK 1: Uncapped SELECT * fetching entire database history without LIMIT
    const ordersResult = await pool.query(
      \`SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC\`,
      [userId]
    );
    const orders = ordersResult.rows;

    // CATASTROPHIC N+1 QUERY PROBLEM: For every single order, 3 additional database queries are executed sequentially!
    for (const order of orders) {
      // Query 1: Order items
      const itemsResult = await pool.query(
        \`SELECT * FROM order_items WHERE order_id = $1\`,
        [order.id]
      );
      order.items = itemsResult.rows;

      // Query 2: Product details for each item inside nested loop (N * M queries!)
      for (const item of order.items) {
        const productResult = await pool.query(
          \`SELECT name, sku, weight, warehouse_location FROM products WHERE id = $1\`,
          [item.product_id]
        );
        item.product = productResult.rows[0];
      }

      // Query 3: Shipping tracking details
      const shipmentResult = await pool.query(
        \`SELECT * FROM shipments WHERE order_id = $1\`,
        [order.id]
      );
      order.shipment = shipmentResult.rows[0];
    }

    // MEMORY BOTTLENECK: Sending uncompressed 50MB JSON payload
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ error: 'Database query failed' });
  }
});

module.exports = router;`
  }
];
