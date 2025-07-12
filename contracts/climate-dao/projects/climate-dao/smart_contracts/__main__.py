import sys
from pathlib import Path
from pyteal import compileTeal, Mode
from .climate_dao.contract import approval_program, clear_program

artifacts_dir = Path(__file__).parent / "artifacts"
artifacts_dir.mkdir(exist_ok=True)

def build():
    approval = compileTeal(approval_program(), mode=Mode.Application, version=8)
    clear = compileTeal(clear_program(), mode=Mode.Application, version=8)

    (artifacts_dir / "approval.teal").write_text(approval)
    (artifacts_dir / "clear.teal").write_text(clear)

    print("✅ Contracts compiled to /artifacts")

def main():
    if len(sys.argv) < 2:
        print("Usage: python -m smart_contracts [build]")
        return
    if sys.argv[1] == "build":
        build()
    else:
        print("Unknown command")

if __name__ == "__main__":
    main()