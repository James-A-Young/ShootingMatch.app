# Development Quick Reference

## Quick Start Commands

```bash
# Install dependencies
npm install

# Start development server (with Turbopack)
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Run tests
npx jest

# Start Genkit AI development
npm run genkit:dev

# Watch mode for Genkit
npm run genkit:watch
```

## Common Development Tasks

### Adding a New UI Component
```typescript
// src/components/ui/my-component.tsx
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const myComponentVariants = cva(
  "base-classes",
  {
    variants: {
      variant: {
        default: "default-variant-classes",
        secondary: "secondary-variant-classes",
      },
      size: {
        default: "default-size-classes",
        sm: "small-size-classes",
        lg: "large-size-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(myComponentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
MyComponent.displayName = "MyComponent"

export { MyComponent, myComponentVariants }
```

### Creating an API Route
```typescript
// src/app/api/my-endpoint/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Your logic here
    
    return NextResponse.json({ data: "success" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Similar pattern for POST requests
}
```

### Adding a Database Model
```typescript
// src/db/my-entity.model.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IMyEntity extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const MyEntitySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

export const MyEntityModel = mongoose.models.MyEntity || mongoose.model<IMyEntity>('MyEntity', MyEntitySchema);
```

### Creating a Repository
```typescript
// src/db/my-entity.repository.ts
import { MyEntityModel, IMyEntity } from './my-entity.model';

export class MyEntityRepository {
  static async create(data: Partial<IMyEntity>): Promise<IMyEntity> {
    const entity = new MyEntityModel(data);
    return await entity.save();
  }

  static async findById(id: string): Promise<IMyEntity | null> {
    return await MyEntityModel.findById(id);
  }

  static async findAll(): Promise<IMyEntity[]> {
    return await MyEntityModel.find();
  }

  static async updateById(id: string, data: Partial<IMyEntity>): Promise<IMyEntity | null> {
    return await MyEntityModel.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteById(id: string): Promise<boolean> {
    const result = await MyEntityModel.findByIdAndDelete(id);
    return !!result;
  }
}
```

## Environment Setup

Create `.env.local` file with:
```bash
# Database
MONGODB_URI=mongodb://localhost:27017/shooting-match

# NextAuth
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft OAuth (optional)
AZURE_AD_CLIENT_ID=your-azure-client-id
AZURE_AD_CLIENT_SECRET=your-azure-client-secret
AZURE_AD_TENANT_ID=your-azure-tenant-id
```

## Useful VS Code Extensions

- TypeScript Importer
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Thunder Client (for API testing)

## Database Development

Start MongoDB with Docker:
```bash
docker-compose up -d
```

Stop MongoDB:
```bash
docker-compose down
```

## Testing Patterns

```typescript
// tests/my-feature.test.ts
import { describe, it, expect, beforeEach } from '@jest/globals';

describe('My Feature', () => {
  beforeEach(() => {
    // Setup before each test
  });

  it('should perform expected behavior', async () => {
    // Arrange
    const input = 'test-input';
    
    // Act
    const result = await myFunction(input);
    
    // Assert
    expect(result).toBe('expected-output');
  });
});
```