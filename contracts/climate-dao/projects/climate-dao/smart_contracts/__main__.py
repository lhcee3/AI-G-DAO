from contract import approval_program, clear_state_program

with open("approval.teal", "w") as f:
    f.write(approval_program().teal())

with open("clear.teal", "w") as f:
    f.write(clear_state_program().teal())
