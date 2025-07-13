from smart_contracts.contract import approval_program, clear_program

if __name__ == "__main__":
    with open("approval.teal", "w") as f:
        f.write(approval_program().teal())

    with open("clear.teal", "w") as f:
        f.write(clear_program().teal())
