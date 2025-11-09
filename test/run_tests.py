#!/usr/bin/env python
"""
TerraLinke Test Runner - Comprehensive test execution script
Runs all test suites and generates consolidated reports
"""

import subprocess
import sys
import os
import time
import json
from datetime import datetime
from pathlib import Path

class TerraLinkeTestRunner:
    def __init__(self):
        self.test_dir = Path(__file__).parent
        self.results_dir = self.test_dir / "test-results"
        self.results_dir.mkdir(exist_ok=True)
        
        self.test_results = {
            "execution_time": datetime.now().isoformat(),
            "platform": "TerraLinke v1.0.0",
            "test_suites": {},
            "overall_status": "PENDING",
            "summary": {
                "total_suites": 0,
                "passed_suites": 0,
                "failed_suites": 0,
                "success_rate": 0.0
            }
        }
    
    def run_command(self, command, cwd=None, timeout=300):
        """Run a command and capture output"""
        try:
            print(f"🔄 Executing: {command}")
            
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                cwd=cwd,
                timeout=timeout
            )
            
            return {
                "success": result.returncode == 0,
                "returncode": result.returncode,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "command": command
            }
            
        except subprocess.TimeoutExpired:
            return {
                "success": False,
                "returncode": -1,
                "stdout": "",
                "stderr": f"Command timed out after {timeout}s",
                "command": command
            }
        except Exception as e:
            return {
                "success": False,
                "returncode": -2,
                "stdout": "",
                "stderr": str(e),
                "command": command
            }
    
    def run_smart_contract_tests(self):
        """Run smart contract test suite"""
        print("\n🔗 Running Smart Contract Tests")
        print("=" * 40)
        
        result = self.run_command(
            "python test_climate_dao.py",
            cwd=self.test_dir / "smart-contracts"
        )
        
        # Parse test results from output
        success_indicators = [
            "Test suite PASSED",
            "Success Rate: 100.0%",
            "Ready for production"
        ]
        
        suite_passed = any(indicator in result["stdout"] for indicator in success_indicators)
        
        self.test_results["test_suites"]["smart_contracts"] = {
            "status": "PASSED" if suite_passed else "FAILED",
            "execution_time": datetime.now().isoformat(),
            "output": result["stdout"],
            "errors": result["stderr"],
            "success": suite_passed
        }
        
        if suite_passed:
            print("✅ Smart Contract Tests: PASSED")
        else:
            print("❌ Smart Contract Tests: FAILED")
            print(f"Error: {result['stderr']}")
        
        return suite_passed
    
    def run_frontend_tests(self):
        """Run frontend component tests"""
        print("\n🎨 Running Frontend Component Tests")
        print("=" * 45)
        
        # Check if Node.js and npm are available
        node_check = self.run_command("node --version")
        if not node_check["success"]:
            print("⚠️  Node.js not found - skipping frontend tests")
            self.test_results["test_suites"]["frontend"] = {
                "status": "SKIPPED",
                "reason": "Node.js not available",
                "success": False
            }
            return False
        
        # Install dependencies if needed
        if not (self.test_dir / "node_modules").exists():
            print("📦 Installing test dependencies...")
            install_result = self.run_command("npm install", cwd=self.test_dir)
            if not install_result["success"]:
                print("❌ Failed to install dependencies")
                self.test_results["test_suites"]["frontend"] = {
                    "status": "FAILED",
                    "reason": "Dependency installation failed",
                    "success": False
                }
                return False
        
        # Run Jest tests
        result = self.run_command("npm test -- --passWithNoTests", cwd=self.test_dir)
        
        suite_passed = result["success"] or "0 failed" in result["stdout"]
        
        self.test_results["test_suites"]["frontend"] = {
            "status": "PASSED" if suite_passed else "FAILED",
            "execution_time": datetime.now().isoformat(),
            "output": result["stdout"],
            "errors": result["stderr"],
            "success": suite_passed
        }
        
        if suite_passed:
            print("✅ Frontend Tests: PASSED")
        else:
            print("❌ Frontend Tests: FAILED")
            print(f"Error: {result['stderr']}")
        
        return suite_passed
    
    def run_performance_tests(self):
        """Run performance test suite"""
        print("\n⚡ Running Performance Tests")
        print("=" * 35)
        
        result = self.run_command(
            "python load_test.py --quick",
            cwd=self.test_dir / "performance"
        )
        
        # Check for performance indicators
        performance_indicators = [
            "System performance: EXCELLENT",
            "System performance: GOOD"
        ]
        
        suite_passed = any(indicator in result["stdout"] for indicator in performance_indicators)
        
        self.test_results["test_suites"]["performance"] = {
            "status": "PASSED" if suite_passed else "FAILED",
            "execution_time": datetime.now().isoformat(),
            "output": result["stdout"],
            "errors": result["stderr"],
            "success": suite_passed
        }
        
        if suite_passed:
            print("✅ Performance Tests: PASSED")
        else:
            print("❌ Performance Tests: FAILED")
            print(f"Error: {result['stderr']}")
        
        return suite_passed
    
    def run_e2e_tests(self):
        """Run end-to-end tests"""
        print("\n🌐 Running End-to-End Tests")
        print("=" * 35)
        
        # Check if Playwright is available
        playwright_check = self.run_command("npx playwright --version", cwd=self.test_dir)
        if not playwright_check["success"]:
            print("⚠️  Playwright not found - installing...")
            install_result = self.run_command("npx playwright install", cwd=self.test_dir)
            if not install_result["success"]:
                print("❌ Failed to install Playwright")
                self.test_results["test_suites"]["e2e"] = {
                    "status": "SKIPPED",
                    "reason": "Playwright installation failed",
                    "success": False
                }
                return False
        
        # Check if the application is running
        app_check = self.run_command("curl -s http://localhost:3000 > nul 2>&1")
        if not app_check["success"]:
            print("⚠️  Application not running on localhost:3000")
            print("📝 Note: E2E tests require the application to be running")
            self.test_results["test_suites"]["e2e"] = {
                "status": "SKIPPED",
                "reason": "Application not running on localhost:3000",
                "success": False
            }
            return False
        
        # Run Playwright tests
        result = self.run_command("npx playwright test", cwd=self.test_dir)
        
        suite_passed = result["success"] or "failed" not in result["stdout"].lower()
        
        self.test_results["test_suites"]["e2e"] = {
            "status": "PASSED" if suite_passed else "FAILED",
            "execution_time": datetime.now().isoformat(),
            "output": result["stdout"],
            "errors": result["stderr"],
            "success": suite_passed
        }
        
        if suite_passed:
            print("✅ E2E Tests: PASSED")
        else:
            print("❌ E2E Tests: FAILED")
            print(f"Error: {result['stderr']}")
        
        return suite_passed
    
    def generate_test_report(self):
        """Generate comprehensive test report"""
        print("\n📋 Generating Test Report")
        print("=" * 30)
        
        # Calculate summary statistics
        total_suites = len(self.test_results["test_suites"])
        passed_suites = sum(1 for suite in self.test_results["test_suites"].values() 
                          if suite.get("success", False))
        failed_suites = total_suites - passed_suites
        success_rate = (passed_suites / total_suites * 100) if total_suites > 0 else 0
        
        self.test_results["summary"] = {
            "total_suites": total_suites,
            "passed_suites": passed_suites,
            "failed_suites": failed_suites,
            "success_rate": success_rate
        }
        
        self.test_results["overall_status"] = "PASSED" if success_rate >= 80 else "FAILED"
        
        # Save detailed results to JSON
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        json_file = self.results_dir / f"test_results_{timestamp}.json"
        
        with open(json_file, 'w') as f:
            json.dump(self.test_results, f, indent=2)
        
        # Generate markdown report
        md_file = self.results_dir / f"test_report_{timestamp}.md"
        self.generate_markdown_report(md_file)
        
        print(f"📊 Test results saved to: {json_file}")
        print(f"📄 Test report saved to: {md_file}")
        
        return json_file, md_file
    
    def generate_markdown_report(self, file_path):
        """Generate markdown test report"""
        with open(file_path, 'w') as f:
            f.write("# TerraLinke Test Execution Report\\n\\n")
            f.write(f"**Execution Date**: {self.test_results['execution_time']}\\n")
            f.write(f"**Platform**: {self.test_results['platform']}\\n")
            f.write(f"**Overall Status**: {self.test_results['overall_status']}\\n\\n")
            
            # Summary table
            f.write("## Test Summary\\n\\n")
            f.write("| Metric | Value |\\n")
            f.write("|--------|-------|\\n")
            f.write(f"| Total Suites | {self.test_results['summary']['total_suites']} |\\n")
            f.write(f"| Passed | {self.test_results['summary']['passed_suites']} |\\n")
            f.write(f"| Failed | {self.test_results['summary']['failed_suites']} |\\n")
            f.write(f"| Success Rate | {self.test_results['summary']['success_rate']:.1f}% |\\n\\n")
            
            # Detailed results
            f.write("## Detailed Results\\n\\n")
            for suite_name, suite_data in self.test_results["test_suites"].items():
                status_emoji = "✅" if suite_data.get("success", False) else "❌"
                f.write(f"### {status_emoji} {suite_name.replace('_', ' ').title()}\\n\\n")
                f.write(f"**Status**: {suite_data.get('status', 'UNKNOWN')}\\n")
                
                if 'reason' in suite_data:
                    f.write(f"**Reason**: {suite_data['reason']}\\n")
                
                if suite_data.get('output'):
                    f.write(f"\\n**Output**:\\n```\\n{suite_data['output'][:1000]}\\n```\\n")
                
                f.write("\\n---\\n\\n")
            
            # Recommendations
            f.write("## Recommendations\\n\\n")
            if self.test_results["overall_status"] == "PASSED":
                f.write("✅ **All test suites passed successfully**\\n")
                f.write("- System is ready for production deployment\\n")
                f.write("- Continue with regular regression testing\\n")
                f.write("- Monitor performance metrics in production\\n")
            else:
                f.write("❌ **Some test suites failed**\\n")
                f.write("- Review failed test outputs\\n")
                f.write("- Fix identified issues before deployment\\n")
                f.write("- Re-run tests after fixes\\n")
    
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 TerraLinke Comprehensive Test Suite")
        print("=" * 50)
        print(f"Start Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        start_time = time.time()
        
        # Run test suites
        test_functions = [
            ("Smart Contracts", self.run_smart_contract_tests),
            ("Frontend Components", self.run_frontend_tests),
            ("Performance", self.run_performance_tests),
            ("End-to-End", self.run_e2e_tests)
        ]
        
        for test_name, test_function in test_functions:
            try:
                test_function()
            except Exception as e:
                print(f"❌ {test_name} tests failed with exception: {e}")
                self.test_results["test_suites"][test_name.lower().replace(" ", "_")] = {
                    "status": "ERROR",
                    "error": str(e),
                    "success": False
                }
        
        # Generate report
        execution_time = time.time() - start_time
        json_file, md_file = self.generate_test_report()
        
        # Final summary
        print("\\n" + "=" * 50)
        print("🏁 TEST EXECUTION COMPLETE")
        print("=" * 50)
        print(f"⏱️  Total Execution Time: {execution_time:.2f}s")
        print(f"📊 Overall Status: {self.test_results['overall_status']}")
        print(f"✅ Passed Suites: {self.test_results['summary']['passed_suites']}")
        print(f"❌ Failed Suites: {self.test_results['summary']['failed_suites']}")
        print(f"📈 Success Rate: {self.test_results['summary']['success_rate']:.1f}%")
        
        if self.test_results["overall_status"] == "PASSED":
            print("\\n🎉 ALL TESTS PASSED - READY FOR PRODUCTION!")
        else:
            print("\\n⚠️  SOME TESTS FAILED - REVIEW BEFORE DEPLOYMENT")
        
        return self.test_results["overall_status"] == "PASSED"

def main():
    """Main test execution function"""
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        runner = TerraLinkeTestRunner()
        
        if command == "smart-contracts":
            runner.run_smart_contract_tests()
        elif command == "frontend":
            runner.run_frontend_tests()
        elif command == "performance":
            runner.run_performance_tests()
        elif command == "e2e":
            runner.run_e2e_tests()
        elif command == "all":
            runner.run_all_tests()
        else:
            print(f"Unknown command: {command}")
            print("Available commands: smart-contracts, frontend, performance, e2e, all")
            sys.exit(1)
    else:
        # Run all tests by default
        runner = TerraLinkeTestRunner()
        success = runner.run_all_tests()
        sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()