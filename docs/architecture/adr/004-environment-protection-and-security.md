# ADR 004: Environment Protection & Security Boundaries

- **Status:** Accepted
- **Date:** 2026-01-20
- **Decision Owners:** Kaique Borges

# 1. Context

Prisma is a personal finance management application handling sensitive financial data for Brazilian users. Security is paramount to maintain user trust, comply with regulations, and protect against unauthorized access. This ADR establishes security boundaries and protection strategies for staging and production environments.

## 1.1. Threat Model

- **Primary Threats:** Unauthorized access to financial data, brute force attacks, data exfiltration, service disruption
- **Secondary Threats:** Credential stuffing, API abuse, insider threats, compliance violations
- **Risk Context:** As a solo-developed application with financial data, we prioritize defense-in-depth while maintaining development velocity

## 1.2. Environment Overview

- **Staging:** Internal-only environment for E2E testing and release validation
- **Production:** Public-facing environment requiring enterprise-grade security with user-friendly access
- **Shared Infrastructure:** Vercel (web), Render (API), Neon (database), Clerk (authentication)

## 1.3. Constraints

- Solo developer context: Minimize custom implementation time
- Financial application: LGPD compliance and data protection critical
- User experience: Security should not impede usability
- Iterative development: Start with conservative defaults, refine based on data

# 2. Decision

## 2.1. Cloudflare as Security Perimeter

We will use Cloudflare as the primary security layer for both staging and production environments, providing WAF, SSL/TLS, and DDoS protection.

**Rationale:**

- Reduces development time compared to custom implementation
- Provides enterprise-grade security features out-of-the-box
- Balances security with usability for a solo developer
- Aligns with our decision to use managed services (like Clerk) for non-differentiating concerns

## 2.2. Environment-Specific Protection Strategies

**Staging Environment:**

- IP whitelisting as primary protection (internal-only access)
- Rate limiting to prevent abuse during testing
- Authentication via Clerk staging environment

**Production Environment:**

- Defense-in-depth approach with multiple security layers
- Public access with comprehensive protection
- LGPD compliance framework

## 2.3. Rate Limiting in Express

Rate limiting will be implemented in Express API to mitigate brute force and abuse attempts, with different thresholds based on endpoint sensitivity.

We choose Express in favor of Cloudflare's rate limiting due to it being a paid feature.

## 2.4. Tiered Monitoring Strategy

- **Priority 1 (Immediate Alerts):** Security breach indicators (failed login spikes, WAF triggers, unauthorized access)
- **Priority 2 (15-minute Alerts):** Service health issues (API errors, database failures)
- **Priority 3 (Daily Reports):** Business metrics (user anomalies, calculation errors)

## 2.5. LGPD Compliance Framework

- Data minimization and purpose limitation
- Defined retention policies (active: indefinite, inactive: 6 months trigger deletion)
- User rights implementation (access, correction, deletion)
- Transparent documentation (privacy policy, cookie policy)

# 3. Alternatives Considered

## 3.1. Self-Implemented Security

- **Considered:** Custom WAF in Express/Node.js
- **Rejected:** Would require significant development time and maintenance burden for a solo developer, increasing risk of security gaps

## 3.2. AWS Shield/CloudFront

- **Considered:** AWS-native security services
- **Rejected:** Higher complexity and cost compared to Cloudflare's simplicity, especially given our Vercel/Render/Neon stack

## 3.3. VPN-Only Staging Access

- **Considered:** Require VPN connection for staging access
- **Rejected:** Adds operational complexity and setup time, while IP whitelisting provides sufficient protection for solo development

# 4. Consequences

## 4.1. Positive

- **Reduced Development Time:** Cloudflare eliminates weeks of custom security implementation
- **Enterprise-Grade Security:** Multiple layers of protection appropriate for financial data
- **Scalable Architecture:** Easy to enhance security as the application grows
- **Compliance Foundation:** LGPD framework provides strong starting point
- **User Trust:** Demonstrates serious approach to data protection
- **Portfolio Value:** Shows senior-level security thinking and pragmatic trade-offs

## 4.2. Negative

- **Vendor Dependency:** Reliance on Cloudflare availability and pricing evolution
- **Configuration Complexity:** Learning curve for Cloudflare dashboard and rules
- **Cost:** Potential upgrade to paid Cloudflare plan as traffic grows
- **False Positives:** Rate limiting may occasionally block legitimate users
- **Iterative Adjustments:** Security settings may need tuning based on real usage

## 4.3. Risks and Mitigations

- **Risk:** Cloudflare outage affects both environments
  - **Mitigation:** Monitor Cloudflare status, have fallback IP restrictions at hosting level
- **Risk:** Rate limiting too aggressive impacts usability
  - **Mitigation:** Start lenient, monitor closely, adjust based on data
- **Risk:** LGPD non-compliance
  - **Mitigation:** Conservative data handling, transparent policies, legal review at scale

## 4.4. Future Considerations

- **Team Growth:** May need more sophisticated access controls
- **Scale:** Enhanced monitoring and automated incident response
- **Compliance:** Full legal review for LGPD certification
- **Advanced Threats:** Consider additional layers (penetration testing) at scale
