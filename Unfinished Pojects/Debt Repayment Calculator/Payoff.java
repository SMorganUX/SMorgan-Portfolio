import java.util.ArrayList;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;
import java.util.Scanner;

public class Payoff {
    Scanner scanner = new Scanner(System.in);
    private List<Debt> debts;
    private double totalInterestPaid;
    private double totalMinPayment;

    public Payoff(List<Debt> debts, double totalMinPayment, double totalDebt) {
        this.debts = new ArrayList<>();
        for (Debt d : debts) {
        this.debts.add(d.clone()); // Deep copy each Debt object
        }
        this.totalMinPayment = totalMinPayment;
        this.totalInterestPaid = 0.0;
    }

    public void runPayoffSimulation() {
        // Choose Debt Payoff Method
        System.out.print("\nChoose payoff method: \n1. Snowball (smallest balance first)\n2. Avalanche (highest interest rate first)\nEnter 1 or 2: ");
        int methodChoice = Integer.parseInt(scanner.nextLine().trim());
        String method = (methodChoice == 1) ? "Snowball" : "Avalanche";

        // Enter Monthly Payment
        double monthlyPayment = 0.0;
        while (true) {
            System.out.print("Enter your total monthly payment amount: $");
            monthlyPayment = Double.parseDouble(scanner.nextLine().trim());
            if (monthlyPayment < totalMinPayment) {
                System.out.printf("WARNING: Your total monthly payment ($%.2f) is less than your total minimum payments ($%.2f). Interest may accrue faster.\n", monthlyPayment, totalMinPayment);
                System.out.print("Proceed anyway? (y/n): ");
                if (!scanner.nextLine().trim().equalsIgnoreCase("y")) continue;
            }
            break;
        }

        // Sort debts based on chosen method
        List<Debt> sortedDebts = new ArrayList<>(); // make copy of original debt list
        for (Debt d : debts) {
            sortedDebts.add(d.clone()); // Deep copy for sorting
        }
        if (method.equals("Snowball")) {
            sortedDebts.sort(Comparator.comparingDouble(Debt::getBalance));
        } else {
            sortedDebts.sort(Comparator.comparingDouble(Debt::getInterestRate).reversed());
        }

        //Debt Payoff Simulation
        int month = 0;
        double totalInterestPaid = 0.0;
        System.out.println("\nPayoff Plan (" + method + " Method):");
        System.out.printf("%-5s %-20s %-15s %-15s\n", "Month", "Focused Debt", "Total Debt", "Interest Paid");

        while(!sortedDebts.isEmpty()) {
            month++;
            double remainingPayment = monthlyPayment;
            double monthInterest = 0.0;

            // Total interest accrued
            for (Debt d : sortedDebts) {
                double interest = d.calculateMonthlyInterest();
                d.setBalance(d.getBalance() + interest);
                monthInterest += interest;
                totalInterestPaid += interest;
            }

            // Pay minimums first
            for (Debt d : sortedDebts) {
                if (remainingPayment <= 0) break;
                double payment = Math.min(d.getMinPayment(), remainingPayment);
                d.setBalance(d.getBalance() - payment);
                remainingPayment -= payment;
            }

            //Apply extra to focused debt
            if (!sortedDebts.isEmpty() && remainingPayment > 0) {
                Iterator<Debt> iterator = sortedDebts.iterator();
                while (iterator.hasNext() && remainingPayment > 0) {
                    Debt focused = iterator.next();
                    double balance = focused.getBalance();
                    if (balance <= remainingPayment) {
                        // Pay off this debt fully
                        focused.setBalance(0);
                        remainingPayment -= balance;
                        iterator.remove(); // Remove paid-off debt immediately
                    } else {
                        // Apply remaining payment and stop
                        focused.setBalance(balance - remainingPayment);
                        remainingPayment = 0;
                    }
                }
            }

            // Remove paid-off debts and resort if needed
            sortedDebts.removeIf(d -> d.getBalance() <= 0);
            if (method.equals("Snowball")) {
                sortedDebts.sort(Comparator.comparingDouble(Debt::getBalance));
            } else {
                sortedDebts.sort(Comparator.comparingDouble(Debt::getInterestRate).reversed());
            }

            // Calculate current total debt
            double currentTotalDebt = 0.0;
            for (Debt d : sortedDebts) {
                currentTotalDebt += Math.max(0, d.getBalance());
            }

            // Print Row
            String focusedName = sortedDebts.isEmpty() ? "None" : sortedDebts.get(0).getName();
            System.out.printf("%-5d %-20s $%-14.2f $%-14.2f\n", month, focusedName, currentTotalDebt, monthInterest);

            if (currentTotalDebt <= 0) break;
            }
        System.out.printf("\nAll debts paid off in %d months!\nTotal Interest Paid: $%.2f\n", month, totalInterestPaid);
    }
    
    public double getTotalInterestPaid() {
        return totalInterestPaid;
    }
}
