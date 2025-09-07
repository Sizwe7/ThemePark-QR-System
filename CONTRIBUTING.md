# Contributing to Theme Park QR Payment & Entrance System

Thank you for your interest in contributing to the Theme Park QR Payment & Entrance System! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide detailed information** including:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, versions)
   - Screenshots or error logs if applicable

### Suggesting Features

1. **Open a feature request** using the appropriate template
2. **Describe the use case** and business value
3. **Provide mockups or examples** if applicable
4. **Consider implementation complexity** and alternatives

### Code Contributions

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Write or update tests** for your changes
5. **Update documentation** as needed
6. **Submit a pull request**

## 🏗️ Development Setup

### Prerequisites

- Java 17+ (for Spring Boot)
- Python 3.11+ (for Flask)
- Node.js 20+ (for React)
- PostgreSQL 15+
- Redis 7+
- Git

### Local Development

1. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/ThemePark-QR-System.git
   cd ThemePark-QR-System
   ```

2. **Set up the database**
   ```bash
   createdb themepark_qr_system
   psql -d themepark_qr_system -f backend/database/init-scripts/01_create_schemas.sql
   psql -d themepark_qr_system -f backend/database/init-scripts/02_sample_data.sql
   ```

3. **Start services in development mode**
   ```bash
   # Terminal 1: Analytics Service
   cd backend/analytics-service
   source venv/bin/activate
   python src/main.py

   # Terminal 2: Core API
   cd backend/core-api
   ./mvnw spring-boot:run

   # Terminal 3: Visitor App
   cd frontend/visitor-mobile-app
   pnpm run dev

   # Terminal 4: Staff Dashboard
   cd frontend/staff-dashboard
   pnpm run dev
   ```

## 📝 Coding Standards

### Java (Spring Boot)

- **Follow Spring Boot conventions**
- **Use meaningful variable and method names**
- **Write comprehensive JavaDoc comments**
- **Implement proper error handling**
- **Use dependency injection appropriately**

```java
/**
 * Service for managing theme park tickets
 * 
 * @author Your Name
 * @since 1.0.0
 */
@Service
@Transactional
public class TicketService {
    
    private final TicketRepository ticketRepository;
    
    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }
    
    /**
     * Creates a new ticket for the specified user
     * 
     * @param userId the user ID
     * @param ticketType the type of ticket
     * @return the created ticket
     * @throws TicketCreationException if ticket creation fails
     */
    public Ticket createTicket(UUID userId, TicketType ticketType) {
        // Implementation
    }
}
```

### Python (Flask)

- **Follow PEP 8 style guide**
- **Use type hints where appropriate**
- **Write comprehensive docstrings**
- **Implement proper error handling**
- **Use meaningful variable names**

```python
from typing import List, Optional
from flask import Blueprint, jsonify

def get_visitor_analytics(start_date: str, end_date: str) -> dict:
    """
    Retrieve visitor analytics for the specified date range.
    
    Args:
        start_date: Start date in YYYY-MM-DD format
        end_date: End date in YYYY-MM-DD format
        
    Returns:
        Dictionary containing analytics data
        
    Raises:
        ValueError: If date format is invalid
        AnalyticsError: If data retrieval fails
    """
    # Implementation
```

### JavaScript/React

- **Use functional components with hooks**
- **Follow ESLint configuration**
- **Use meaningful component and variable names**
- **Implement proper prop validation**
- **Write JSDoc comments for complex functions**

```javascript
/**
 * Component for displaying attraction information
 * 
 * @param {Object} props - Component props
 * @param {Object} props.attraction - Attraction data
 * @param {Function} props.onJoinQueue - Callback for joining queue
 * @returns {JSX.Element} Attraction card component
 */
function AttractionCard({ attraction, onJoinQueue }) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleJoinQueue = async () => {
    setIsLoading(true);
    try {
      await onJoinQueue(attraction.id);
    } catch (error) {
      console.error('Failed to join queue:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    // JSX implementation
  );
}
```

## 🧪 Testing Guidelines

### Backend Testing

- **Write unit tests** for all service methods
- **Write integration tests** for API endpoints
- **Use meaningful test names** that describe the scenario
- **Follow AAA pattern** (Arrange, Act, Assert)
- **Mock external dependencies**

```java
@Test
@DisplayName("Should create ticket successfully for valid user")
void shouldCreateTicketSuccessfullyForValidUser() {
    // Arrange
    UUID userId = UUID.randomUUID();
    TicketType ticketType = TicketType.SINGLE_DAY;
    
    // Act
    Ticket result = ticketService.createTicket(userId, ticketType);
    
    // Assert
    assertThat(result).isNotNull();
    assertThat(result.getUserId()).isEqualTo(userId);
    assertThat(result.getTicketType()).isEqualTo(ticketType);
}
```

### Frontend Testing

- **Write component tests** using React Testing Library
- **Test user interactions** and state changes
- **Mock API calls** and external dependencies
- **Test accessibility** features

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import AttractionCard from './AttractionCard';

test('should call onJoinQueue when join button is clicked', async () => {
  const mockOnJoinQueue = jest.fn();
  const attraction = { id: '1', name: 'Test Attraction', status: 'open' };
  
  render(<AttractionCard attraction={attraction} onJoinQueue={mockOnJoinQueue} />);
  
  const joinButton = screen.getByText('Join Queue');
  fireEvent.click(joinButton);
  
  expect(mockOnJoinQueue).toHaveBeenCalledWith('1');
});
```

## 📚 Documentation

### Code Documentation

- **Write clear, concise comments**
- **Document complex business logic**
- **Include examples in documentation**
- **Keep documentation up to date**

### API Documentation

- **Use OpenAPI/Swagger annotations**
- **Provide request/response examples**
- **Document error codes and messages**
- **Include authentication requirements**

### README Updates

- **Update installation instructions** if dependencies change
- **Add new features** to the feature list
- **Update configuration** examples
- **Include troubleshooting** information

## 🔄 Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
   ```bash
   # Backend tests
   cd backend/core-api && ./mvnw test
   cd backend/analytics-service && python -m pytest
   
   # Frontend tests
   cd frontend/visitor-mobile-app && pnpm test
   cd frontend/staff-dashboard && pnpm test
   ```

2. **Run code quality checks**
   ```bash
   # Java: Checkstyle, SpotBugs
   cd backend/core-api && ./mvnw verify
   
   # Python: flake8, black
   cd backend/analytics-service && flake8 src/
   
   # JavaScript: ESLint, Prettier
   cd frontend/visitor-mobile-app && pnpm lint
   ```

3. **Update documentation** as needed

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass locally
```

### Review Process

1. **Automated checks** must pass
2. **At least one reviewer** approval required
3. **Address review feedback** promptly
4. **Squash commits** before merging
5. **Update branch** if needed

## 🐛 Bug Reports

### Security Issues

**Do not open public issues for security vulnerabilities.** Instead:

1. **Email security concerns** to: sc.maseko@themepark.com
2. **Include detailed information** about the vulnerability
3. **Allow time for investigation** before public disclosure

### Bug Report Template

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen

**Actual Behavior**
What actually happened

**Environment**
- OS: [e.g., Windows 10, macOS 12.0]
- Browser: [e.g., Chrome 95, Firefox 94]
- Version: [e.g., 1.0.0]

**Additional Context**
Screenshots, logs, or other relevant information
```

## 🎯 Feature Requests

### Feature Request Template

```markdown
**Feature Description**
Clear description of the proposed feature

**Use Case**
Why is this feature needed? What problem does it solve?

**Proposed Solution**
How should this feature work?

**Alternatives Considered**
Other solutions you've considered

**Additional Context**
Mockups, examples, or other relevant information
```

## 📋 Code Review Guidelines

### For Authors

- **Keep PRs small** and focused
- **Write clear commit messages**
- **Respond to feedback** constructively
- **Test thoroughly** before submitting

### For Reviewers

- **Be constructive** and respectful
- **Focus on code quality** and maintainability
- **Check for security** issues
- **Verify tests** are adequate
- **Approve promptly** when ready

## 🏆 Recognition

Contributors will be recognized in:

- **CONTRIBUTORS.md** file
- **Release notes** for significant contributions
- **Project documentation** for major features

## 📞 Getting Help

- **GitHub Discussions**: For general questions
- **GitHub Issues**: For bug reports and feature requests
- **Email**: sc.maseko@themepark.com for direct contact

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to the Theme Park QR Payment & Entrance System! 🎢

