import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Database, 
  Shield, 
  Radio,
  Users,
  FileText,
  QrCode,
  Battery,
  Server,
  Lock,
  RefreshCw,
  AlertTriangle
} from "lucide-react";

const MeshArchitecture = () => {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8 print:p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-primary">
            🌐 Medithos Mesh Network Architecture
          </h1>
          <p className="text-xl text-muted-foreground">
            Emergency-Ready Healthcare System - Offline & Autonomous Operation
          </p>
          <div className="flex justify-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-sm">Version 1.0</Badge>
            <Badge variant="secondary" className="text-sm">Status: Stand-by</Badge>
            <Badge className="text-sm bg-amber-500">Priority: High</Badge>
          </div>
        </div>

        <Separator />

        {/* Executive Summary */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Σε περίπτωση έκτακτης ανάγκης (πόλεμος, blackout, φυσική καταστροφή), 
              το Medithos θα μπορεί να λειτουργεί αυτόνομα χωρίς σύνδεση στο internet, 
              επιτρέποντας την ανταλλαγή ιατρικών δεδομένων μεταξύ κοντινών συσκευών.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <h4 className="font-semibold text-green-600">Offline Mode</h4>
                <p className="text-sm text-muted-foreground">Πλήρης λειτουργία χωρίς internet</p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <h4 className="font-semibold text-blue-600">Mesh Network</h4>
                <p className="text-sm text-muted-foreground">P2P επικοινωνία μεταξύ συσκευών</p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <h4 className="font-semibold text-purple-600">Auto-Sync</h4>
                <p className="text-sm text-muted-foreground">Αυτόματος συγχρονισμός όταν επανέλθει</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Architecture Layers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              System Architecture Layers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Layer 1 */}
              <div className="p-4 bg-gradient-to-r from-red-500/10 to-transparent rounded-lg border-l-4 border-red-500">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-red-500">Layer 1</Badge>
                  <h4 className="font-semibold">Presentation Layer (UI)</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• React PWA με offline-first design</li>
                  <li>• Service Worker για caching</li>
                  <li>• Responsive emergency UI mode</li>
                  <li>• Low-bandwidth optimized interface</li>
                </ul>
              </div>

              {/* Layer 2 */}
              <div className="p-4 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg border-l-4 border-orange-500">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-orange-500">Layer 2</Badge>
                  <h4 className="font-semibold">Local Data Layer</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• IndexedDB για structured data</li>
                  <li>• LocalStorage για settings/preferences</li>
                  <li>• SQLite (via Capacitor) για native</li>
                  <li>• Encrypted medical records cache</li>
                </ul>
              </div>

              {/* Layer 3 */}
              <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-lg border-l-4 border-yellow-500">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-yellow-500 text-black">Layer 3</Badge>
                  <h4 className="font-semibold">Mesh Communication Layer</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Bluetooth Low Energy (BLE) Mesh</li>
                  <li>• WiFi Direct / WiFi Aware</li>
                  <li>• NFC για close-range data transfer</li>
                  <li>• QR Code fallback για manual sharing</li>
                </ul>
              </div>

              {/* Layer 4 */}
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-transparent rounded-lg border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-green-500">Layer 4</Badge>
                  <h4 className="font-semibold">Sync & Conflict Resolution</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• CRDT (Conflict-free Replicated Data Types)</li>
                  <li>• Vector clocks για ordering</li>
                  <li>• Background sync queue</li>
                  <li>• Delta sync για bandwidth optimization</li>
                </ul>
              </div>

              {/* Layer 5 */}
              <div className="p-4 bg-gradient-to-r from-blue-500/10 to-transparent rounded-lg border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-blue-500">Layer 5</Badge>
                  <h4 className="font-semibold">Security Layer</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• End-to-end encryption (AES-256)</li>
                  <li>• Device-based key management</li>
                  <li>• Biometric authentication fallback</li>
                  <li>• Emergency access codes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Flow Diagram */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-primary" />
              Data Flow - Normal vs Emergency Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Normal Mode */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-green-500" />
                  <h4 className="font-semibold text-green-600">Normal Mode (Online)</h4>
                </div>
                <div className="bg-green-500/5 p-4 rounded-lg border border-green-500/20 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Device</span>
                    <span className="text-green-500">→</span>
                    <Server className="h-4 w-4" />
                    <span>Supabase Cloud</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span>Real-time sync</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span>TLS encryption</span>
                  </div>
                </div>
              </div>

              {/* Emergency Mode */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5 text-red-500" />
                  <h4 className="font-semibold text-red-600">Emergency Mode (Offline)</h4>
                </div>
                <div className="bg-red-500/5 p-4 rounded-lg border border-red-500/20 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span>Device A</span>
                    <span className="text-blue-500">⟷</span>
                    <Radio className="h-4 w-4" />
                    <span>BLE Mesh</span>
                    <span className="text-blue-500">⟷</span>
                    <Smartphone className="h-4 w-4" />
                    <span>Device B</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <span>Local IndexedDB</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span>E2E encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mesh Network Topology */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-primary" />
              Mesh Network Topology
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-6 rounded-lg">
              <pre className="text-xs md:text-sm overflow-x-auto">
{`
                    ┌─────────────────────────────────────────────────────────┐
                    │                   MESH NETWORK TOPOLOGY                  │
                    └─────────────────────────────────────────────────────────┘

                                        📱 Doctor A
                                            │
                                    BLE ────┼──── BLE
                                   /        │        \\
                              📱 Patient 1  │    📱 Patient 2
                                   \\        │        /
                                    \\       │       /
                                     \\      │      /
                              WiFi Direct ──┼── WiFi Direct
                                       \\    │    /
                                        \\   │   /
                                         \\  │  /
                                      📱 Nurse (Hub)
                                            │
                                       BLE Mesh
                                      /    │    \\
                                     /     │     \\
                              📱 Patient 3 │  📱 Doctor B
                                           │
                                      📱 Patient 4


                    ┌─────────────────────────────────────────────────────────┐
                    │  Communication Methods:                                  │
                    │  ─────────────────────                                   │
                    │  BLE Mesh    : ~100m range, low power                   │
                    │  WiFi Direct : ~200m range, high bandwidth              │
                    │  NFC         : ~10cm range, instant pairing             │
                    │  QR Code     : Visual, no wireless needed               │
                    └─────────────────────────────────────────────────────────┘
`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle>🛠️ Technology Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">PWA & Offline</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Workbox (Service Worker)</li>
                  <li>• IndexedDB (Dexie.js)</li>
                  <li>• Cache API</li>
                  <li>• Background Sync API</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">Native Capabilities</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Capacitor Core</li>
                  <li>• @capacitor-community/bluetooth-le</li>
                  <li>• capacitor-wifi-connect</li>
                  <li>• @capawesome/capacitor-nfc</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">Data & Sync</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Yjs (CRDT library)</li>
                  <li>• RxDB (Reactive DB)</li>
                  <li>• PouchDB (sync)</li>
                  <li>• Delta sync protocol</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">Security</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Web Crypto API</li>
                  <li>• libsodium.js</li>
                  <li>• Biometric Auth</li>
                  <li>• Secure Enclave (iOS)</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">QR & Visual</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• qrcode.react</li>
                  <li>• html5-qrcode</li>
                  <li>• Compression (pako)</li>
                  <li>• Base64 encoding</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 text-primary">Backend Fallback</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Supabase (primary)</li>
                  <li>• Edge Functions</li>
                  <li>• Realtime subscriptions</li>
                  <li>• Conflict resolution</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Models for Offline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Offline Data Schema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/30 p-4 rounded-lg overflow-x-auto">
              <pre className="text-xs md:text-sm">
{`// IndexedDB Schema for Offline Medical Records

interface OfflineMedicalRecord {
  id: string;                    // UUID
  user_id: string;               // Owner
  version: number;               // For conflict resolution
  vector_clock: VectorClock;     // CRDT ordering
  
  // Medical Data (encrypted)
  encrypted_data: {
    allergies: string[];
    chronic_conditions: string[];
    current_medications: string[];
    blood_type: string;
    emergency_contacts: Contact[];
  };
  
  // Sync Metadata
  sync_status: 'synced' | 'pending' | 'conflict';
  last_synced_at: Date | null;
  local_updated_at: Date;
  
  // Sharing
  shared_with: string[];         // Device IDs
  share_expiry: Date | null;
}

interface EmergencyProfile {
  id: string;
  full_name: string;
  date_of_birth: string;
  blood_type: string;
  allergies: string[];
  emergency_medications: string[];
  emergency_contacts: {
    name: string;
    phone: string;
    relationship: string;
  }[];
  qr_code_data: string;          // Compressed JSON
  last_updated: Date;
}

interface MeshMessage {
  id: string;
  type: 'medical_record' | 'emergency_alert' | 'sync_request';
  sender_device_id: string;
  recipient_device_id: string | 'broadcast';
  payload: EncryptedPayload;
  timestamp: Date;
  ttl: number;                   // Time to live (hops)
  signature: string;             // Digital signature
}`}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Emergency Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  QR Medical Card
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>✓ Offline QR code generation</li>
                  <li>✓ Compressed medical data</li>
                  <li>✓ Scannable by any device</li>
                  <li>✓ Emergency info without app</li>
                  <li>✓ Printable backup card</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Radio className="h-4 w-4" />
                  BLE Emergency Beacon
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>✓ Broadcast emergency status</li>
                  <li>✓ Discover nearby medical staff</li>
                  <li>✓ Share location (GPS cached)</li>
                  <li>✓ Request assistance</li>
                  <li>✓ Low battery mode</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Triage Mode
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>✓ Mass casualty interface</li>
                  <li>✓ Quick patient tagging</li>
                  <li>✓ Priority sorting (RED/YELLOW/GREEN)</li>
                  <li>✓ Resource allocation</li>
                  <li>✓ Multi-device coordination</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Battery className="h-4 w-4" />
                  Power Saving Mode
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>✓ Minimal UI mode</li>
                  <li>✓ Reduced sync frequency</li>
                  <li>✓ Essential features only</li>
                  <li>✓ Dark mode enforcement</li>
                  <li>✓ Background process limits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Phases */}
        <Card>
          <CardHeader>
            <CardTitle>📅 Implementation Roadmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Phase 1 */}
              <div className="relative pl-8 pb-6 border-l-2 border-green-500">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-green-500" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500">Phase 1</Badge>
                    <span className="font-semibold">PWA Offline Foundation</span>
                    <Badge variant="outline">2-3 εβδομάδες</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Service Worker setup με Workbox</li>
                    <li>• IndexedDB schema implementation</li>
                    <li>• Offline detection & UI indicators</li>
                    <li>• Basic data caching strategy</li>
                    <li>• Manifest & installability</li>
                  </ul>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative pl-8 pb-6 border-l-2 border-blue-500">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-blue-500" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-500">Phase 2</Badge>
                    <span className="font-semibold">Local Data & Sync</span>
                    <Badge variant="outline">3-4 εβδομάδες</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• RxDB/Dexie.js integration</li>
                    <li>• CRDT implementation για conflicts</li>
                    <li>• Background sync queue</li>
                    <li>• Encryption layer (Web Crypto)</li>
                    <li>• Offline medical records access</li>
                  </ul>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="relative pl-8 pb-6 border-l-2 border-purple-500">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-purple-500" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-500">Phase 3</Badge>
                    <span className="font-semibold">QR Code System</span>
                    <Badge variant="outline">2 εβδομάδες</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• QR generation για medical data</li>
                    <li>• QR scanner integration</li>
                    <li>• Data compression (pako)</li>
                    <li>• Printable emergency card</li>
                    <li>• Offline QR sharing</li>
                  </ul>
                </div>
              </div>

              {/* Phase 4 */}
              <div className="relative pl-8 pb-6 border-l-2 border-orange-500">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-orange-500" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-500">Phase 4</Badge>
                    <span className="font-semibold">Native Mesh (Capacitor)</span>
                    <Badge variant="outline">4-6 εβδομάδες</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Capacitor BLE plugin integration</li>
                    <li>• WiFi Direct implementation</li>
                    <li>• Mesh routing protocol</li>
                    <li>• Device discovery & pairing</li>
                    <li>• P2P data transfer</li>
                  </ul>
                </div>
              </div>

              {/* Phase 5 */}
              <div className="relative pl-8 border-l-2 border-red-500">
                <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-red-500" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500">Phase 5</Badge>
                    <span className="font-semibold">Emergency Features</span>
                    <Badge variant="outline">3-4 εβδομάδες</Badge>
                  </div>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Emergency beacon mode</li>
                    <li>• Triage interface</li>
                    <li>• Power saving mode</li>
                    <li>• Mass casualty coordination</li>
                    <li>• Full system testing</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium">
                📊 Συνολικός χρόνος υλοποίησης: <strong>14-19 εβδομάδες</strong> (3.5-5 μήνες)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Considerations */}
        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              Security Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Data at Rest</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• AES-256-GCM encryption</li>
                  <li>• Device-bound keys</li>
                  <li>• Biometric unlock</li>
                  <li>• Auto-wipe after failed attempts</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Data in Transit</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• End-to-end encryption</li>
                  <li>• Perfect forward secrecy</li>
                  <li>• Message signing (Ed25519)</li>
                  <li>• Replay attack protection</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Access Control</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Role-based permissions</li>
                  <li>• Time-limited sharing</li>
                  <li>• Emergency access codes</li>
                  <li>• Audit logging</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">GDPR Compliance</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Data minimization</li>
                  <li>• Right to deletion</li>
                  <li>• Consent management</li>
                  <li>• Data portability</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground py-8">
          <p>Medithos Mesh Network Architecture v1.0</p>
          <p>Prepared for Emergency Healthcare Operations</p>
          <p className="mt-2">
            <Badge variant="outline">Status: Stand-by - Ready for Implementation</Badge>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MeshArchitecture;
