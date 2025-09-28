# 🚀 Deployment Guide - Health Risk Profiler

## Overview
This guide provides step-by-step instructions for deploying the AI-Powered Health Risk Profiler to production using Vercel, along with monitoring and optimization configurations.

## 📋 Pre-Deployment Checklist

### ✅ Code Preparation
- [ ] All features tested locally
- [ ] Build passes without errors (`npm run build`)
- [ ] TypeScript compilation successful
- [ ] No console errors in production build
- [ ] Environment variables configured

### ✅ Performance Optimization
- [ ] Images optimized and compressed
- [ ] Bundle size analyzed
- [ ] Unused dependencies removed
- [ ] Static assets optimized

### ✅ Security Review
- [ ] Input validation implemented
- [ ] Error handling configured
- [ ] No sensitive data in client code
- [ ] Security headers configured

## 🎯 Deployment Methods

### Method 1: Vercel (Recommended)

#### Step 1: Prepare Repository
```bash
# Ensure your code is in a Git repository
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 2: Deploy to Vercel
1. **Visit [Vercel Dashboard](https://vercel.com/dashboard)**
2. **Click "New Project"**
3. **Import your Git repository**
4. **Configure project settings:**
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

#### Step 3: Environment Variables
In Vercel dashboard, go to Settings → Environment Variables and add:

**Production Variables:**
```
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
APP_NAME=Health Risk Profiler
APP_VERSION=1.0.0
OCR_PROCESSING_TIMEOUT=30000
OCR_MAX_FILE_SIZE=10485760
OCR_CONFIDENCE_THRESHOLD=0.75
SECURE_HEADERS=true
RATE_LIMIT_ENABLED=true
```

**Optional Monitoring Variables:**
```
SENTRY_DSN=your_sentry_dsn_here
ANALYTICS_ID=your_analytics_id
GOOGLE_ANALYTICS_ID=your_ga_id
```

#### Step 4: Deploy
1. Click **"Deploy"**
2. Wait for build completion
3. Test the deployed application
4. Configure custom domain (optional)

### Method 2: Other Platforms

#### Netlify
```bash
# Build command
npm run build

# Publish directory
.next

# Environment variables (same as Vercel)
```

#### Docker Deployment
```dockerfile
# Use the Dockerfile in the project root
docker build -t health-risk-profiler .
docker run -p 3000:3000 health-risk-profiler
```

## 🔧 Configuration

### Environment Variables Reference

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | Yes |
| `APP_NAME` | Application name | `Health Risk Profiler` | No |
| `APP_VERSION` | Version number | `1.0.0` | No |
| `APP_URL` | Application URL | `http://localhost:3000` | No |
| `OCR_PROCESSING_TIMEOUT` | OCR timeout (ms) | `30000` | No |
| `OCR_MAX_FILE_SIZE` | Max file size (bytes) | `10485760` | No |
| `OCR_CONFIDENCE_THRESHOLD` | OCR confidence threshold | `0.75` | No |
| `SECURE_HEADERS` | Enable security headers | `false` | No |
| `RATE_LIMIT_ENABLED` | Enable rate limiting | `false` | No |
| `SENTRY_DSN` | Sentry error tracking | - | No |
| `ANALYTICS_ID` | Analytics tracking | - | No |

### Custom Domain Setup (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Wait for SSL certificate provisioning

## 📊 Monitoring & Analytics

### Error Tracking with Sentry
1. Create account at [Sentry.io](https://sentry.io)
2. Create new Next.js project
3. Add `SENTRY_DSN` to environment variables
4. Install Sentry SDK:
```bash
npm install @sentry/nextjs
```

### Performance Monitoring
- **Vercel Analytics**: Automatic with Vercel Pro
- **Google Analytics**: Add `GOOGLE_ANALYTICS_ID`
- **Custom Monitoring**: Use `/api/health-check` endpoint

### Health Check Endpoint
Monitor application health via: `https://your-domain.com/api/health-check`

Response format:
```json
{
  "status": "healthy",
  "timestamp": "2025-09-28T12:00:00.000Z",
  "version": "1.0.0",
  "services": {
    "database": "healthy",
    "ocr": "healthy",
    "api": "healthy"
  }
}
```

## ⚡ Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze

# Check for unused dependencies
npx depcheck

# Optimize images
npm run optimize-images
```

### Caching Strategy
- **Static Assets**: 1 year cache (configured in `vercel.json`)
- **API Routes**: No cache (dynamic content)
- **Pages**: ISR with revalidation

### CDN Configuration
Vercel automatically provides:
- Global CDN distribution
- Image optimization
- Static asset compression
- Brotli/Gzip compression

## 🔒 Security Configuration

### Security Headers
Configured in `vercel.json`:
- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

### Rate Limiting
- API endpoints: 100 requests per 15 minutes
- File uploads: 10 uploads per hour
- OCR processing: 5 concurrent requests

### Data Privacy
- No persistent user data storage
- Session-based temporary storage only
- GDPR compliant processing
- Clear privacy disclaimers

## 🚨 Troubleshooting

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

#### OCR Processing Issues
- Check file size limits
- Verify image format support
- Monitor processing timeouts

#### Performance Issues
- Enable compression
- Optimize images
- Use static optimization
- Monitor bundle size

#### Environment Variable Issues
- Verify variable names
- Check for typos
- Ensure proper escaping
- Test locally first

### Debug Mode
Enable debug logging:
```
ENABLE_DEBUG_LOGS=true
```

### Support Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Project GitHub Issues](https://github.com/your-repo/issues)

## 📈 Post-Deployment

### Testing Checklist
- [ ] All pages load correctly
- [ ] OCR functionality works
- [ ] Risk assessment processes
- [ ] Recommendations generate
- [ ] Mobile responsiveness
- [ ] Error handling works
- [ ] Performance acceptable

### Monitoring Setup
- [ ] Error tracking configured
- [ ] Performance monitoring active
- [ ] Health checks responding
- [ ] Analytics tracking
- [ ] Uptime monitoring

### Maintenance
- [ ] Set up automated security updates
- [ ] Schedule regular backups
- [ ] Monitor error rates
- [ ] Review performance metrics
- [ ] Update dependencies quarterly

## 🎉 Success!

Your Health Risk Profiler is now live! 

**Next Steps:**
1. Share the application URL with users
2. Monitor initial usage and errors
3. Gather user feedback
4. Plan feature updates
5. Scale as needed

**Production URL Format:**
- Vercel: `https://your-project-name.vercel.app`
- Custom domain: `https://your-domain.com`

---

*For additional support or questions, refer to the project documentation or create an issue in the repository.*